import {
    SET_ERROR,
    SET_LOCATION,
    SET_MAPBOX_ACCESS_TOKEN,
    SET_RESOURCES,
    SET_TOKEN,
    SET_TOKEN_INFO,
    SET_USER,
    SettingActions
} from './actionTypes';
import {StoreState} from "./StoreState";

const initialState: StoreState = {
    mapboxAccessToken: null,
    resources: null,
    location: [31.182233, 48.382778],
    user: null,
    tokenInfo:null,
    token: null,
    errorOpen: false,
    errorMessage: null,
};

const envReducer = (state = initialState, action: SettingActions) => {
    switch (action.type) {
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
        case SET_LOCATION:
            return {
                ...state,
                location: action.payload,
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case SET_TOKEN_INFO:
            return {
                ...state,
                tokenInfo: action.payload
            };
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        case SET_ERROR:
            return {
                ...state,
                errorOpen: action.payload.errorOpen,
                errorMessage: action.payload.errorMessage
            };
        default:
            return state;
    }
};

export default envReducer;
