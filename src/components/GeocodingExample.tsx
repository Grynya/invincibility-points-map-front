import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import {useSelector} from "react-redux";
import {StoreState} from "../store/StoreState";

mapboxgl.accessToken = 'your access token';

export default function GeocodingExample() {
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState(null);
    const mapboxAccessToken = useSelector((state: StoreState) => state.mapboxAccessToken);

    const handleSearch = async () => {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxAccessToken}`);
        const data = await response.json();
        const coordinates = data.features[0].center;
        setLocation(coordinates);
    }

    return (
        <div>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            {location && (
                <div>
                    <p>Latitude: {location[1]}</p>
                    <p>Longitude: {location[0]}</p>
                </div>
            )}
        </div>
    );
}
