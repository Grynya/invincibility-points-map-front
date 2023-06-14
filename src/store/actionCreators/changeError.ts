import {ActionCreator} from 'redux';
import {SET_ERROR} from "../actionTypes";
import {ChangeError} from "../actions/ChangeError";

export const changeError: ActionCreator<ChangeError> = (errorMessage: string | null) => {
    return {
            type: SET_ERROR,
            payload: {
                errorOpen: errorMessage!==null,
                errorMessage: errorMessage,
            },
        };
};