import {ActionCreator} from 'redux';
import {SET_TOKEN} from "../actionTypes";
import {ChangeToken} from "../actions/ChangeToken";

export const changeToken: ActionCreator<ChangeToken> = (token) => {
    return {
        type: SET_TOKEN,
        payload: token
    }
}