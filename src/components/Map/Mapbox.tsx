import React, {useEffect, useRef, useState} from 'react';
import mapboxgl, {IControl, Map} from 'mapbox-gl';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import pointService from "../../service/PointService";
import {Feature, Point} from "geojson";
import MapPoint from "../../model/MapPoint";

interface Props {
    setOpenedPoint: React.Dispatch<React.SetStateAction<MapPoint | null>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapBox: React.FC<Props> = ({setOpenedPoint, setOpen}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | null>(null);
    const [control, setControl] = useState<IControl | null>(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);
    const location = useSelector((state: StoreState) => state.location);
    useEffect(() => {

        if (mapboxAccessToken && mapContainer.current) {
            mapboxgl.accessToken = mapboxAccessToken

            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: location,
                maxBounds: [[22.15, 44.39], [40.22, 52.37]],
                zoom: 12
            });
            setControl(new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                language: 'ukr',
                countries: 'ua'
            }));
            map.on('load', function () {
                loadPoints(map);
            });
            map.on('moveend', function () {
                const zoom = map.getZoom();
                if (zoom >= 8) {
                    loadPoints(map);
                } else if (map.getLayer('points')){
                    map.removeLayer('points');
                }

            });

            map.on('zoomend', function () {
                const zoom = map.getZoom();
                if (zoom >= 8) {
                    loadPoints(map);
                } else if (map.getLayer('points')){
                    map.removeLayer('points');
                }
            });

            setMap(map);
        }
    }, [mapboxAccessToken]);

    useEffect(() => {
        if (map && mapContainer.current && !map.hasControl(control as IControl)) {
            if (control) map.addControl(control);
        }
    }, [map, control]);

    async function loadPoints(map: Map) {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        const points: MapPoint[] = await pointService.getPoints({
            userId: 1,
            sw: {lng: bounds.getSouthWest().lng, lat: bounds.getSouthWest().lat},
            ne: {lng: bounds.getNorthEast().lng, lat: bounds.getNorthEast().lat},
            zoom: zoom
        })
        if (map.getLayer('points')) {
            map.removeLayer('points');
        }
        if (map.getSource('points')) {
            map.removeSource('points');
        }
        if (map) {
            map.on('click', 'points', function (e) {
                const features = map.queryRenderedFeatures(e.point, {layers: ['points']});
                if (!features.length) {
                    return;
                }
                const clickedPoint = features[0].properties;
                if (clickedPoint) {
                    setOpenedPoint({
                        id: clickedPoint.id,
                        name: clickedPoint.name,
                        description: clickedPoint.description,
                        hoursOfWork: clickedPoint.hoursOfWork,
                        phone: clickedPoint.phone,
                        coordinates: JSON.parse(clickedPoint.coordinates),
                        photos:JSON.parse(clickedPoint.photos),
                        resources: JSON.parse(clickedPoint.resources),
                        userId:clickedPoint.usetId
                    });
                    setOpen(true);
                }


            });
        }

        const pointsToDraw: Feature<Point>[] = points.map(point => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [point.coordinates.lng, point.coordinates.lat],
            },
            properties: {
                id: point.id,
                name: point.name,
                description: point.description,
                hoursOfWork: point.hoursOfWork,
                phone: point.phone,
                coordinates: point.coordinates,
                photos: point.photos,
                resources: point.resources
            },
        }));
        map.on('mouseenter', 'points', function (e) {
            const features = map.queryRenderedFeatures(e.point, { layers: ['points'] });
            if (!features.length) {
                return;
            }
            map.getCanvas().style.cursor = 'pointer';
            const hoveredFeature = features[0];
            if (hoveredFeature && hoveredFeature.properties) {
                map.setPaintProperty('points', 'circle-color', [
                    'match',
                    ['get', 'id'], hoveredFeature.properties.id,
                    'red',
                    'blue'
                ]);
            }
        });
        map.on('mouseleave', 'points', function () {
            map.getCanvas().style.cursor = '';
            map.setPaintProperty('points', 'circle-color', 'blue'); // Change this to the normal color
        });
        map.addLayer({
            id: 'points',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: pointsToDraw
                }
            },
            interactive: true,
            paint: {
                'circle-radius': 12,
                'circle-color': 'blue'
            }
        });
    }

    return (
        <div ref={mapContainer} style={{height: '100vh'}}/>
    );
};

export default MapBox;