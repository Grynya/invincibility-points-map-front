import {Action} from "redux";
import {SET_RESOURCES} from "../actionTypes";
import Resource from "../../interfaces/Resource";

export interface ChangeResources extends Action {
    type: typeof SET_RESOURCES;
    payload: Resource[];
}