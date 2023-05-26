import React, {useEffect, useRef, useState} from 'react';
import mapboxgl, {IControl, Map} from 'mapbox-gl';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import pointService from "../../service/MapPointService";
import {Feature, Point} from "geojson";
import MapPoint from "../../model/MapPoint";

interface Props {
    setOpenedPoint: React.Dispatch<React.SetStateAction<MapPoint | null>>;

    open: boolean;

    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapBox: React.FC<Props> = ({ setOpenedPoint, open, setOpen}) => {
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
            map.loadImage('img/placeholder.png', (error, image) => {
                if (error) {
                    console.error('Failed to load the image:', error);
                } else {
                    // @ts-ignore
                    map.addImage('placeholder', image);
                    map.once('style.load', () => {
                        loadPoints(map);
                    });
                }
            });
            map.loadImage('img/placeholder-on-hover.png', (error, image) => {
                if (error) {
                    console.error('Failed to load the image:', error);
                } else {
                    // @ts-ignore
                    map.addImage('placeholder-on-hover', image);
                    map.once('style.load', () => {
                        loadPoints(map);
                    });
                }
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
                } else if (map.getLayer('points')) {
                    map.removeLayer('points');
                }

            });

            map.on('zoomend', function () {
                const zoom = map.getZoom();
                if (zoom >= 8) {
                    loadPoints(map);
                } else if (map.getLayer('points')) {
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
    const selectedFeatureIdRef = useRef(null);

    useEffect(() => {
        if (map && !open) {
            map.setLayoutProperty('points', 'icon-image', 'placeholder');
            selectedFeatureIdRef.current=null;
        }
    }, [open])

    async function loadPoints(map: Map) {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        const points: MapPoint[] = await pointService.getPoints({
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
                        photos: JSON.parse(clickedPoint.photos),
                        resources: JSON.parse(clickedPoint.resources),
                        userId: clickedPoint.userId
                    });
                    selectedFeatureIdRef.current = clickedPoint.id; // Update the mutable reference

                    setOpen(true);
                    if (selectedFeatureIdRef.current !== null) {
                        map.setFeatureState(
                            {source: 'points', id: selectedFeatureIdRef.current},
                            {selected: false}
                        );
                    }

                    map.setFeatureState(
                        {source: 'points', id: clickedPoint.id},
                        {selected: true}
                    );
                    map.setLayoutProperty('points', 'icon-image', [
                        'match',
                        ['get', 'id'],
                        clickedPoint.id,
                        'placeholder-on-hover',
                        'placeholder'
                    ]);
                }
            });
            map.on('mouseenter', 'points',
                () => map.getCanvas().style.cursor = 'pointer');

            map.on('mouseleave', 'points',
                () => map.getCanvas().style.cursor = '');
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

        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: pointsToDraw
                }
            },
            layout: {
                'icon-image': [
                    'case',
                    ['!=', ['get', 'id'], selectedFeatureIdRef.current],
                    'placeholder',
                    'placeholder-on-hover'
                ],
                'icon-size': 0.03,
                'icon-allow-overlap': true
            },
            paint: {}
        });

    }

    return (
        <React.Fragment>
            <div ref={mapContainer} style={{height: '90vh'}}/>
        </React.Fragment>
    );
};

export default MapBox;