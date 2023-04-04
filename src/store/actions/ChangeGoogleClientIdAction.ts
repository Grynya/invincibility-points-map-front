import {Action} from "redux";
import {SET_GOOGLE_CLIENT_ID} from "../actionTypes";

export interface ChangeGoogleClientIdAction extends Action {
    type: typeof SET_GOOGLE_CLIENT_ID;
    payload: string;
}