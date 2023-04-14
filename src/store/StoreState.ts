import Resource from "../model/Resource";
import {LngLatLike} from "mapbox-gl";

export interface StoreState {
    googleClientId: string | null;
    mapboxAccessToken: string | null;
    resources: Resource[] | null;
    location: LngLatLike
}