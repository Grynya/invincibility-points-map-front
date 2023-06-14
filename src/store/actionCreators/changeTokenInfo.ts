import {ActionCreator} from 'redux';
import {ChangeTokenInfo} from "../actions/ChangeTokenInfo";
import {SET_TOKEN_INFO} from "../actionTypes";

export const changeTokenInfo: ActionCreator<ChangeTokenInfo> = (tokenInfo) => {
    return {
        type: SET_TOKEN_INFO,
        payload: tokenInfo
    }
}