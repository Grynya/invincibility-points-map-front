import React, {useEffect, useRef, useState} from "react";
import mapboxgl, {IControl, LngLatLike, Map, Marker} from "mapbox-gl";
import {FormGroup, InputLabel} from "@mui/material";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

interface Props {
    coordinates: LngLatLike|undefined;
    setCoordinates: React.Dispatch<React.SetStateAction<LngLatLike|undefined>>;
}

const MapboxSmall: React.FC<Props> = ({coordinates, setCoordinates}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);
    const controlRef = useRef<IControl | null>(null);
    const [addressString, setAddressString] = useState<String | null>(null);
    // const location = useSelector((state: StoreState) => state.location);

    const getAddress = async (lngLat: LngLatLike) => {
        const geocodingClient = MapboxGeocoding({accessToken: mapboxAccessToken});
        if (lngLat) {
            if (lngLat instanceof mapboxgl.LngLat) {
                const response = await geocodingClient.reverseGeocode({
                    query: [lngLat.lng, lngLat.lat],
                    types: ["address"],
                    limit: 1,
                }).send();
                (response.body.features.length > 0) ?
                    setAddressString(response.body.features[0].place_name) : setAddressString(null);
            }
        }
    }

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

                    setCoordinates(markerRef.current!.getLngLat());
                    getAddress(markerRef.current!.getLngLat());

                    markerRef.current.on("dragend", async () => {
                        const lngLat: LngLatLike = markerRef.current!.getLngLat();
                        setCoordinates(lngLat);
                        getAddress(lngLat);
                    });
                });

                controlRef.current = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                    countries: 'ua',
                });

                if (controlRef.current && !mapInstance.hasControl(controlRef.current as IControl)) {
                    mapInstance.addControl(controlRef.current);
                }
            };

            if (!map) initializeMap({setMap, mapContainer});
        }
    }, [map, mapboxAccessToken, setCoordinates]);

    return (
        <FormGroup sx={{mt: 1, mb: 1}}>
            <InputLabel sx={{mt: 1, mb: 1}}>Адреса: {addressString}</InputLabel>
            <div
                ref={(el) => (mapContainer.current = el)}
                style={{width: "100%", height: "30vh"}}
            ></div>
        </FormGroup>
    );
};

export default MapboxSmall;
