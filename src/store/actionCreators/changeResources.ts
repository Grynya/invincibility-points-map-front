import {ActionCreator} from 'redux';
import {ChangeResources} from "../actions/ChangeResources";
import {SET_RESOURCES} from "../actionTypes";

export const changeResources: ActionCreator<ChangeResources> = (resources) => {
    return {
        type: SET_RESOURCES,
        payload: resources
    }
}