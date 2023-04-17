import {LngLatLike} from "mapbox-gl";
import Resource from "../../model/Resource";

export default interface CreatePointRequest {
    name: string;
    description: string;
    phone: string;
    hoursOfWork: string;
    coordinates: LngLatLike;
    photos: File[];
    resources: Resource[];
    userId: number;
}