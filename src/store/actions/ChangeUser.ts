import {Action} from "redux";
import {SET_USER} from "../actionTypes";
import User from "../../model/User";

export interface ChangeUser extends Action {
    type: typeof SET_USER;
    payload: User | null;
}