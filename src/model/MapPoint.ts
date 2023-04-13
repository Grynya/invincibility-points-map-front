import Resource from "./Resource";
import Coordinates from "./Coordinates";

export default interface MapPoint {
    id: number;
    name: string;
    description: string;
    hoursOfWork: string;
    phone: string;
    coordinates: Coordinates;
    photos: string;
    resources: Resource[];
}