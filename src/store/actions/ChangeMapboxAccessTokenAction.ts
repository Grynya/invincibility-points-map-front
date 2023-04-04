import {Action} from "redux";
import {SET_MAPBOX_ACCESS_TOKEN} from "../actionTypes";

export interface ChangeMapboxAccessTokenAction extends Action {
    type: typeof SET_MAPBOX_ACCESS_TOKEN;
    payload: string;
}