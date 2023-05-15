import {ChangeMapboxAccessTokenAction} from "./actions/ChangeMapboxAccessTokenAction";
import {ChangeResources} from "./actions/ChangeResources";
import {ChangeLocation} from "./actions/ChangeLocation";
import {ChangeUser} from "./actions/ChangeUser";
import {ChangeTokenInfo} from "./actions/ChangeTokenInfo";
import {ChangeToken} from "./actions/ChangeToken";

export const SET_MAPBOX_ACCESS_TOKEN = 'SET_MAPBOX_ACCESS_TOKEN';
export const SET_RESOURCES = 'SET_RESOURCES';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_USER = 'SET_USER';
export const SET_TOKEN_INFO = 'SET_TOKEN_INFO';
export const SET_TOKEN = 'SET_TOKEN';

export type SettingActions = ChangeMapboxAccessTokenAction
    | ChangeResources | ChangeLocation | ChangeUser | ChangeTokenInfo | ChangeToken;