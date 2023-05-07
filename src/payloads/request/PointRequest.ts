import Coordinates from "../../model/Coordinates";

export default interface PointRequest {
    sw: Coordinates;
    ne: Coordinates;
    zoom: number;
    userId: number | null;
}