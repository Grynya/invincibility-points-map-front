import Resource from "../model/Resource";
import {LngLatLike} from "mapbox-gl";
import User from "../model/User";
import TokenInfo from "../model/TokenInfo";
import Token from "../model/Token";

export interface StoreState {
    mapboxAccessToken: string | null;
    resources: Resource[] | null;
    location: LngLatLike;
    user: User | null;
    tokenInfo: TokenInfo | null;
    token: Token | null;
}