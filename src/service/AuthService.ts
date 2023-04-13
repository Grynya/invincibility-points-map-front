import axios, {AxiosResponse} from 'axios';
import {AppSettings} from "../AppSettings";
import store from "../store/store"
import {Store} from 'redux';
import {JwtResponse} from "../payloads/JwtResponse";
import {JwtRefreshResponse} from "../payloads/JwtRefreshResponse";


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

    async login(username: string, password: string): Promise<boolean> {
        try {

            const response: AxiosResponse<JwtResponse> = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/signin`, {
                username,
                password,
            });

            const {accessToken, refreshToken, expiresIn, name, surname, email, code, userStatus, roles} = response.data;
            localStorage.setItem("user", JSON.stringify({name, surname, email, code, userStatus, roles}));

            localStorage.setItem("access_token", accessToken)
            localStorage.setItem("refresh_token", refreshToken)

            this.scheduleTokenRefresh(expiresIn);

            return true;
        } catch (error) {
            throw new Error(`Authentication failed:${error}`)
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