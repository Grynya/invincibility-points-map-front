import axios, { AxiosResponse } from 'axios';
import {AppSettings} from "../AppSettings";
import Cookies from "universal-cookie"
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

interface RefreshResponse {
    accessToken: string;
    expiresIn: number;
}

class AuthService {
    token: string | null;
    refreshToken: string | null;
    refreshTimeout: ReturnType<typeof setTimeout> | null;

    constructor() {
        this.token = null;
        this.refreshToken = null;
        this.refreshTimeout = null;
    }

    async login(username: string, password: string): Promise<boolean> {
        try {
            const response: AxiosResponse<LoginResponse> = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/signin`, {
                username,
                password,
            });
            const cookie = new Cookies();

            const { accessToken, refreshToken, expiresIn } = response.data;

            this.token = accessToken;
            this.refreshToken = refreshToken;
            cookie.set("access_token", accessToken, {httpOnly: true})
            cookie.set("refresh_token", refreshToken, {httpOnly: true})

            this.scheduleTokenRefresh(expiresIn);

            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            return false;
        }
    }

    async doRefreshToken(): Promise<boolean> {
        try {
            const response: AxiosResponse<RefreshResponse> = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/refreshtoken`, {
                refreshToken: this.refreshToken,
            });

            const { accessToken, expiresIn } = response.data;

            this.token = accessToken;

            this.scheduleTokenRefresh(expiresIn);
            const cookie = new Cookies();
            cookie.get("access_token")

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
            console.log("time")
        }, timeoutDuration);
    }

    logout(): void {
        this.token = null;
        this.refreshToken = null;

        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    getToken(): string | null {
        return this.token;
    }
}

const authService = new AuthService();

export default authService;