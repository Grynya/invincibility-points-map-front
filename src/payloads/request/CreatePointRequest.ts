import Resource from "../../model/Resource";
import {LngLatLike} from "mapbox-gl";

export default interface CreatePointRequest {
    name: string;
    description: string;
    phone: string;
    hoursOfWork: string;
    coordinates: LngLatLike;
    resources: Resource[];
    userId: number | null;
}