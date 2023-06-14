import {Action} from "redux";
import {SET_RESOURCES} from "../actionTypes";
import Resource from "../../model/Resource";

export interface ChangeResources extends Action {
    type: typeof SET_RESOURCES;
    payload: Resource[];
}