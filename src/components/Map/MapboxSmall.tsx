import React, {useEffect, useRef, useState} from "react";
import mapboxgl, {Map, Marker} from "mapbox-gl";

const MapboxSmall: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);

    useEffect(() => {
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
            });
        };

        if (!map) initializeMap({ setMap, mapContainer });
    }, [map]);

    return (
        <div
            ref={(el) => (mapContainer.current = el)}
            style={{ width: "100%", height: "30vh" }}
        ></div>
    );
};

export default MapboxSmall;