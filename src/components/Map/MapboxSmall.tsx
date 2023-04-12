import React, {useEffect, useRef, useState} from "react";
import mapboxgl, {IControl, Map, Marker} from "mapbox-gl";
import Coordinates from "../../model/Coordinates";
import {FormGroup, InputLabel} from "@mui/material";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
interface Props {
    setCoordinates: React.Dispatch<React.SetStateAction<Coordinates | undefined>>;
}

const MapboxSmall: React.FC<Props> = ({ setCoordinates }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);
    const controlRef = useRef<IControl | null>(null);

    useEffect(() => {
        if (mapboxAccessToken) {
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
                    center: [49.0139, 31.2858],
                    maxBounds: [
                        [22.15, 44.39],
                        [40.22, 52.37],
                    ],
                    zoom: 2,
                });

                mapInstance.on("load", () => {
                    setMap(mapInstance);
                    mapInstance.resize();
                });
                mapInstance.on("click", (event) => {
                    if (markerRef.current) {
                        console.log(markerRef.current);
                        markerRef.current.remove(); // Remove the previous marker
                    }
                    markerRef.current = new Marker()
                        .setLngLat(event.lngLat)
                        .addTo(mapInstance); // Update the marker ref
                    setCoordinates({lat: event.lngLat.lat, lng: event.lngLat.lng})
                });
                controlRef.current = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                    countries: 'ua',
                });
                if (controlRef.current && !mapInstance.hasControl(controlRef.current as IControl)) {
                    mapInstance.addControl(controlRef.current);
                    console.log("added")
                }
            };

            if (!map) initializeMap({setMap, mapContainer});
        }
    }, [map, mapboxAccessToken, setCoordinates]);


    return (
        <FormGroup sx={{mt: 3, mb: 1}}>
            <InputLabel>Адреса</InputLabel>
        <div
            ref={(el) => (mapContainer.current = el)}
            style={{ width: "100%", height: "30vh" }}
        ></div>
        </FormGroup>
    );
};

export default MapboxSmall;