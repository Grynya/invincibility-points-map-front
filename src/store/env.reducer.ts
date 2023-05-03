import {
    SET_LOCATION,
    SET_MAPBOX_ACCESS_TOKEN,
    SET_RESOURCES,
    SettingActions
} from './actionTypes';
import {StoreState} from "./StoreState";

const initialState: StoreState = {
    mapboxAccessToken: null,
    resources: null,
    location: [31.182233, 48.382778]
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
        default:
            return state;
    }
};

export default envReducer;
