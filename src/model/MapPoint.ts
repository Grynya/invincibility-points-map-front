import Resource from "./Resource";
import Coordinates from "./Coordinates";
import PointPhoto from "./PointPhoto";

export default interface MapPoint {
    id: number;
    name: string;
    description: string;
    hoursOfWork: string;
    phone: string;
    coordinates: Coordinates;
    photos: PointPhoto[];
    resources: Resource[];
    userId: number;
}