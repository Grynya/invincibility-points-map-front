import {Action} from "redux";
import User from "../../model/User";
import {SET_USER} from "../actionTypes";

export interface ChangeUser extends Action {
    type: typeof SET_USER;
    payload: User;
}