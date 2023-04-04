import { ActionCreator } from 'redux';
import {ChangeMapboxAccessTokenAction} from "../actions/ChangeMapboxAccessTokenAction";
import {SET_MAPBOX_ACCESS_TOKEN} from "../actionTypes";

export const changeMapboxAccessToken: ActionCreator<ChangeMapboxAccessTokenAction> = (newMapboxAccessToken:string) => {
    return {
        type: SET_MAPBOX_ACCESS_TOKEN,
        payload: newMapboxAccessToken
    }
}