import {Action} from "redux";
import {SET_TOKEN} from "../actionTypes";
import Token from "../../model/Token";

export interface ChangeToken extends Action {
    type: typeof SET_TOKEN;
    payload: Token | null;
}