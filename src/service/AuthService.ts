import axios, {AxiosResponse, HttpStatusCode} from 'axios';
import {AppSettings} from "../AppSettings";
import store from "../store/store"
import {Store} from 'redux';
import {JwtResponse} from "../payloads/response/JwtResponse";
import {JwtRefreshResponse} from "../payloads/response/JwtRefreshResponse";
import SignUpRequest from "../payloads/request/SignUpRequest";


class AuthService {
    refreshTimeout: ReturnType<typeof setTimeout> | null;
    store: Store;

    constructor() {
        this.refreshTimeout = null;
        this.store = store

        const storedTimeoutDuration = localStorage.getItem('tokenRefreshTimeoutDuration');
        if (storedTimeoutDuration) {
            const remainingTimeoutDuration = parseInt(storedTimeoutDuration) - (Date.now() - parseInt(localStorage.getItem('tokenRefreshTimeoutStartTime')!));
            if (remainingTimeoutDuration > 0) {
                this.scheduleTokenRefresh(remainingTimeoutDuration);
            }
            localStorage.removeItem('tokenRefreshTimeoutDuration');
            localStorage.removeItem('tokenRefreshTimeoutStartTime');
        }
    }

    async login(username: string, password: string, onFailure: (error: any)=>void,
                onSuccess: ()=>void): Promise<void> {
        try {
            const response: AxiosResponse<JwtResponse> = await axios
                .post(`${AppSettings.API_ENDPOINT}/api/auth/signin`, {
                username,
                password,
            });

            const {accessToken, refreshToken, expiresIn, id, name, surname, email, userStatus, isAdmin} = response.data;
            localStorage.setItem("user", JSON.stringify({id, name, surname, email, userStatus, isAdmin}));

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            this.scheduleTokenRefresh(expiresIn);
            onSuccess();
        } catch (error) {
            onFailure(error)
        }
    }
    async setUserByAccessToken(accessToken: string, onFailure: (error: any)=>void,
                onSuccess: ()=>void): Promise<void> {
        try {
            const response: AxiosResponse<JwtResponse> = await axios
                .get(`${AppSettings.API_ENDPOINT}/user/info-by-access-token?accessToken=${accessToken}`);

            const {id, name, surname, email, userStatus, isAdmin} = response.data;
            localStorage.setItem("user", JSON.stringify({id, name, surname, email, userStatus, isAdmin}));
            onSuccess();
        } catch (error) {
            onFailure(error)
        }
    }
    async registrar(signUpRequest: SignUpRequest, onFailure: (error: any)=>void,
                onSuccess: ()=>void): Promise<void> {
        try {
            const response: AxiosResponse<JwtResponse> = await axios
                .post(`${AppSettings.API_ENDPOINT}/api/auth/signup`, signUpRequest);
            if (response.status===HttpStatusCode.Ok) onSuccess();
        } catch (error) {
            onFailure(error)
        }
    }


    async doRefreshToken(): Promise<boolean> {
        try {
            console.log( localStorage.getItem("refresh_token"))
            let response: AxiosResponse<JwtRefreshResponse>
                = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/refreshtoken`, {
                refreshToken: localStorage.getItem("refresh_token"),
            });

            const {accessToken, refreshToken, expiresIn} = response.data;

            this.scheduleTokenRefresh(expiresIn);
            localStorage.setItem("access_token", accessToken)
            localStorage.setItem("refresh_token", refreshToken)

            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            localStorage.removeItem("user")
            return false;
        }
    }

    scheduleTokenRefresh(expiresIn: number): void {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        const timeoutDuration = expiresIn - 60;

        this.refreshTimeout = setTimeout(() => {
            this.doRefreshToken();
            console.log("refreshed");
            localStorage.setItem('tokenRefreshTimeoutDuration', timeoutDuration.toString());
            localStorage.setItem('tokenRefreshTimeoutStartTime', Date.now().toString());
        }, timeoutDuration);
    }

    logout = (): void => {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        localStorage.removeItem("user")

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('tokenRefreshTimeoutDuration');
        localStorage.removeItem('tokenRefreshTimeoutStartTime');
    }
}

const authService = new AuthService();

export default authService;