import {ChangeMapboxAccessTokenAction} from "./actions/ChangeMapboxAccessTokenAction";
import {ChangeGoogleClientIdAction} from "./actions/ChangeGoogleClientIdAction";
import {ChangeResources} from "./actions/ChangeResources";
import {ChangeLocation} from "./actions/ChangeLocation";

export const SET_MAPBOX_ACCESS_TOKEN = 'SET_MAPBOX_ACCESS_TOKEN';
export const SET_GOOGLE_CLIENT_ID = 'SET_GOOGLE_CLIENT_ID';
export const SET_RESOURCES = 'SET_RESOURCES';
export const SET_LOCATION = 'SET_LOCATION';

export type SettingActions = ChangeMapboxAccessTokenAction | ChangeGoogleClientIdAction
    | ChangeResources | ChangeLocation;