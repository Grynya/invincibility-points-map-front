import mapboxgl, {LngLat, LngLatLike} from "mapbox-gl";
import MapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const getAddress = async (mapboxAccessToken:string, lngLat:any): Promise<string | null>=> {
    const geocodingClient = MapboxGeocoding({ accessToken: mapboxAccessToken });
        if (lngLat) {
            const response = await geocodingClient.reverseGeocode({
                query: [lngLat.lng, lngLat.lat],
                types: ["address"],
                limit: 1,
            }).send();
            return (response.body.features.length > 0) ? response.body.features[0].place_name : null;
        }return null;
    };

export default getAddress;