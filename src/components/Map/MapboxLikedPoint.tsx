import React, {useEffect, useRef, useState} from "react";
import mapboxgl, {IControl, LngLatLike, Map, Marker} from "mapbox-gl";
import {InputLabel} from "@mui/material";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import getAddress from "./getAdressString";

interface Props {
    coordinates: LngLatLike;
}

const MapboxLikedPoints: React.FC<Props> = ({coordinates}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);
    const controlRef = useRef<IControl | null>(null);
    const [addressString, setAddressString] = useState<string | null>(null);

    useEffect(() => {
        if (mapboxAccessToken && coordinates) {
            mapboxgl.accessToken = mapboxAccessToken

            const initializeMap = ({
                                       setMap,
                                       mapContainer,
                                   }: {
                setMap: React.Dispatch<React.SetStateAction<Map | null>>;
                mapContainer: React.RefObject<HTMLDivElement>;
            }) => {
                const mapInstance = new mapboxgl.Map({
                    container: mapContainer.current as HTMLDivElement,
                    style: "mapbox://styles/mapbox/streets-v11",
                    center: coordinates,
                    maxBounds: [
                        [22.15, 44.39],
                        [40.22, 52.37],
                    ],
                    zoom: 12,
                });

                mapInstance.on("load", () => {
                    setMap(mapInstance);
                    mapInstance.resize();
                    markerRef.current = new mapboxgl.Marker({
                        draggable: true
                    })
                        .setLngLat(coordinates)
                        .addTo(mapInstance);

                    getAddress(mapboxAccessToken, markerRef.current!.getLngLat(), setAddressString);

                });

                controlRef.current = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                    countries: 'ua',
                    marker: false
                });
                // @ts-ignore
                controlRef.current.on('result', e => {
                    markerRef.current?.setLngLat(e.result.center);
                });
                if (controlRef.current && !mapInstance.hasControl(controlRef.current as IControl)) {
                    mapInstance.addControl(controlRef.current);
                }
                if (controlRef.current && !mapInstance.hasControl(controlRef.current as IControl)) {
                    mapInstance.addControl(controlRef.current);
                }
            };

            if (!map) initializeMap({setMap, mapContainer});
        }
    } );

    return (
        <div style={{margin: '1px 0'}}>
            <InputLabel sx={{mt: 1, mb: 1, fontWeight:"bold", color: "#000000"}}>Адреса: {addressString}</InputLabel>
            <div
                ref={(el) => (mapContainer.current = el)}
                style={{width: "100%", height: "50vh"}}/>
        </div>
    );
};

export default MapboxLikedPoints;
