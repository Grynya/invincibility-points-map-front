import {Action} from "redux";
import {SET_TOKEN_INFO} from "../actionTypes";
import TokenInfo from "../../model/TokenInfo";

export interface ChangeTokenInfo extends Action {
    type: typeof SET_TOKEN_INFO;
    payload: TokenInfo | null;
}