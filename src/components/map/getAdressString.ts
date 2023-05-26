import mapboxgl, {LngLatLike} from "mapbox-gl";
import MapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const getAddress = async (mapboxAccessToken:string, lngLat: LngLatLike): Promise<string | null>=> {
    const geocodingClient = MapboxGeocoding({ accessToken: mapboxAccessToken });
    console.log(lngLat && lngLat instanceof mapboxgl.LngLat)
        if (lngLat && lngLat instanceof mapboxgl.LngLat) {
            const response = await geocodingClient.reverseGeocode({
                query: [lngLat.lng, lngLat.lat],
                types: ["address"],
                limit: 1,
            }).send();
            if (response.body.features.length > 0) {
                const address = response.body.features[0].place_name;
                console.log("Address:", address); // Log the address
                return address;
            } else {
                console.log("No address found.");
                return null;
            }
        }return null;
    };

export default getAddress;