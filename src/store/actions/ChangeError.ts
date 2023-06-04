import {Action} from "redux";
import {SET_ERROR} from "../actionTypes";

interface SetErrorPayload {
    errorOpen: boolean;
    errorMessage: string | null;
}
export interface ChangeError extends Action<typeof SET_ERROR> {
    payload: SetErrorPayload;
}
