import {ActionCreator} from 'redux';
import {SET_LOCATION} from "../actionTypes";
import {ChangeLocation} from "../actions/ChangeLocation";

export const changeLocation: ActionCreator<ChangeLocation> = (location) => {
    return {
        type: SET_LOCATION,
        payload: location
    }
}