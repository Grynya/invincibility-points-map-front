import mapboxgl, {LngLatLike} from "mapbox-gl";
import React from "react";
import MapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const getAddress = async (mapboxAccessToken:string, lngLat: LngLatLike, setAddressString:React.Dispatch<React.SetStateAction<string | null>>) => {
    const geocodingClient = MapboxGeocoding({accessToken: mapboxAccessToken});
    if (lngLat && lngLat instanceof mapboxgl.LngLat) {
        const response = await geocodingClient.reverseGeocode({
            query: [lngLat.lng, lngLat.lat],
            types: ["address"],
            limit: 1,
        }).send();
        (response.body.features.length > 0) ?
            setAddressString(response.body.features[0].place_name) : setAddressString(null);
    }
}
export default getAddress;