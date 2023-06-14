import axios from 'axios';
import {store} from "./store/store";
import {changeUser} from "./store/actionCreators/changeUser";
import {changeToken} from "./store/actionCreators/changeToken";
import {changeTokenInfo} from "./store/actionCreators/changeTokenInfo";
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
    function (config) {
        const token = store.getState().token;
        if (token) {
            if (token.accessToken) {
                config.headers.Authorization = `Bearer ${token.accessToken}`;
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(changeUser(null));
            store.dispatch(changeToken(null));
            store.dispatch(changeTokenInfo(null));
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;