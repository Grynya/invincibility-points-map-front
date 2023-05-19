import axios from 'axios';
import {store} from "../store/store";
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

export default axiosInstance;