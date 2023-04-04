import { ActionCreator } from 'redux';
import {ChangeGoogleClientIdAction} from "../actions/ChangeGoogleClientIdAction";
import {SET_GOOGLE_CLIENT_ID} from "../actionTypes";
export const changeGoogleClientId: ActionCreator<ChangeGoogleClientIdAction> = (newGoogleClientId) => {
    return {
        type: SET_GOOGLE_CLIENT_ID,
        payload: newGoogleClientId
    }
}