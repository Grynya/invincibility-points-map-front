import Coordinates from "../../model/Coordinates";

export default interface MapPointRequest {
    sw: Coordinates;
    ne: Coordinates;
    zoom: number;
}