import {ActionCreator} from 'redux';
import {SET_USER} from "../actionTypes";
import {ChangeUser} from "../actions/ChangeUser";

export const changeUser: ActionCreator<ChangeUser> = (resources) => {
    return {
        type: SET_USER,
        payload: resources
    }
}