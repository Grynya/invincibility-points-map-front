import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, IControl } from 'mapbox-gl';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";


const MapBox = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    // @ts-ignore
    const [map, setMap] = useState<Map>(null);
    const [control, setControl] = useState<IControl | null>(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);
    useEffect(() => {
        if (mapboxAccessToken && mapContainer.current) {
            mapboxgl.accessToken = mapboxAccessToken
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [49.0139, 31.2858],
                maxBounds: [[22.15, 44.39], [40.22, 52.37]],
                zoom: 1
            });
            setControl(new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                countries: 'ua'
            }));
            setMap(map);
        }
    }, [mapboxAccessToken]);

    useEffect(() => {
        if (map && mapContainer.current && !map.hasControl(control as IControl)) {
            if (control) map.addControl(control);
        }
    }, [map, control]);

    return (
        <div ref={mapContainer} style={{ height: '100vh' }}/>
    );
};

export default MapBox;