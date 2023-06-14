import {Action} from "redux";
import {LngLatLike} from "mapbox-gl";
import {SET_LOCATION} from "../actionTypes";

export interface ChangeLocation extends Action {
    type: typeof SET_LOCATION;
    payload: LngLatLike;
}