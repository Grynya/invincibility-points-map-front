import Resource from "../model/Resource";
import User from "../model/User";

export interface StoreState {
    googleClientId: string | null;
    mapboxAccessToken: string | null;
    resources: Resource[] | null;
    user: User | null
}