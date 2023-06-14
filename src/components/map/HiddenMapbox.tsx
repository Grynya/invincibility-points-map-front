import React, {useEffect, useRef, useState} from "react";
import mapboxgl, {LngLatLike, Map, Marker} from "mapbox-gl";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import getAddress from "./getAdressString";
import Link from "@mui/material/Link";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    coordinates: LngLatLike;
    height: string;
}

const MapboxLikedPoints: React.FC<Props> = ({coordinates, height}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);
    const [addressString, setAddressString] = useState<string | null>(null);
    const [hiddenMap, setHiddenMap] = useState<boolean>(true);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);

    // const showMap=()=>{
    //     setHiddenMap(false);
    // }
    useEffect(() => {
        if (mapboxAccessToken && coordinates) {
            getAddress(mapboxAccessToken, coordinates).then((result) => {
                setAddressString(result);
            });
        }
    }, [mapboxAccessToken, coordinates]);
    useEffect(() => {
        if (!map && !hiddenMap && mapboxAccessToken && coordinates && mapContainer.current) {
            mapboxgl.accessToken = mapboxAccessToken;

            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current,
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
                    draggable: true,
                })
                    .setLngLat(coordinates)
                    .addTo(mapInstance);
            });
        }
    }, [map, hiddenMap, mapboxAccessToken, coordinates]);

    const showMap = () => {
        setHiddenMap(false);
    };

    const closeMap = () => {
        if (map) {
            map.remove();
            setMap(null);
            markerRef.current = null;
        }
        setHiddenMap(true);
    };
    return (
        <div style={{margin: "1px 0"}}>
            <Link
                sx={{mt: 1, mb: 1}}
                variant="h6"
                onClick={showMap}
                className="pointer"
            >
                Адреса: {addressString} (відкрити на мапі)
            </Link>
            {!hiddenMap && (
                <div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{width: "97%"}}/>
                    <CloseIcon onClick={closeMap} color="error" style={{cursor: "pointer"}}/>
                </div>
                <div ref={mapContainer} style={{height: height}} />
                </div>
                )}
        </div>
    );
};

export default MapboxLikedPoints;
