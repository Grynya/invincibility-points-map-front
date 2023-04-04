import Resource from "../interfaces/Resource";

export interface StoreState {
    googleClientId: string | null;
    mapboxAccessToken: string | null;
    resources: Resource[] | null;
}