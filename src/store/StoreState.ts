import Resource from "../model/Resource";

export interface StoreState {
    googleClientId: string | null;
    mapboxAccessToken: string | null;
    resources: Resource[] | null;
}