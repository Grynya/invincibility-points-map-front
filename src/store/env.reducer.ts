import {SET_GOOGLE_CLIENT_ID, SET_MAPBOX_ACCESS_TOKEN, SET_RESOURCES, SettingActions} from './actionTypes';
import {StoreState} from "./StoreState";

const initialState: StoreState = {
    googleClientId: null,
    mapboxAccessToken: null,
    resources: null,
};

const envReducer = (state = initialState, action: SettingActions) => {
    switch (action.type) {
        case SET_GOOGLE_CLIENT_ID:
            return {
                ...state,
                googleClientId: action.payload,
            };
        case SET_MAPBOX_ACCESS_TOKEN:
            return {
                ...state,
                mapboxAccessToken: action.payload,
            };
        case SET_RESOURCES:
            return {
                ...state,
                resources: action.payload,
            };
        default:
            return state;
    }
};

export default envReducer;
