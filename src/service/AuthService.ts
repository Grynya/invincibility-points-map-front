import axios, {AxiosResponse, HttpStatusCode} from 'axios';
import {AppSettings} from "../AppSettings";
import {store} from "../store/store"
import {Store} from 'redux';
import {JwtResponse} from "../payloads/response/JwtResponse";
import {JwtRefreshResponse} from "../payloads/response/JwtRefreshResponse";
import SignUpRequest from "../payloads/request/SignUpRequest";
import MapPoint from "../model/MapPoint";
import {changeUser} from "../store/actionCreators/changeUser";
import {changeTokenInfo} from "../store/actionCreators/changeTokenInfo";
import {changeToken} from "../store/actionCreators/changeToken";
import axiosInstance from "../axiosInstance";
import User from "../model/User";


class AuthService {
    refreshTimeout: ReturnType<typeof setTimeout> | null;
    store: Store;

    constructor() {
        this.refreshTimeout = null;
        this.store = store;
        const tokenInfo = store.getState().tokenInfo;
        if (tokenInfo && tokenInfo.tokenRefreshTimeoutDuration) {
            const storedTimeoutDuration = tokenInfo.tokenRefreshTimeoutDuration;
            const remainingTimeoutDuration =
                storedTimeoutDuration - (Date.now() - tokenInfo.tokenRefreshTimeoutStartTime);
            if (remainingTimeoutDuration > 0) {
                this.scheduleTokenRefresh(remainingTimeoutDuration);
            }
            store.dispatch(changeTokenInfo({
                tokenRefreshTimeoutDuration: null,
                tokenRefreshTimeoutStartTime: null
            }));
        }
    }


    async signin(username: string, password: string, onFailure: (error: any) => void,
                 onSuccess: () => void): Promise<void> {
        try {
            const response: AxiosResponse<JwtResponse> = await axios
                .post(`${AppSettings.API_ENDPOINT}/public/signin`, {
                    username,
                    password,
                });

            const {accessToken, refreshToken, expiresIn, id, name, surname, email, userStatus, roles} = response.data;
            store.dispatch(changeUser({id, name, surname, email, userStatus, roles}));
            store.dispatch(changeToken({
                accessToken: accessToken,
                refreshToken: refreshToken
            }));
            this.scheduleTokenRefresh(expiresIn);
            onSuccess();
        } catch (error) {
            console.log(error)
            onFailure(error);
        }
    }

    async signup(signUpRequest: SignUpRequest, onFailure: () => void,
                 onSuccess: () => void): Promise<void> {
        try {
            const response: AxiosResponse<JwtResponse> = await axios
                .post(`${AppSettings.API_ENDPOINT}/public/signup`, signUpRequest);
            if (response.status === HttpStatusCode.Ok) onSuccess();
        } catch (error) {
            console.log(error)
            onFailure();
        }
    }


    async doRefreshToken(): Promise<void> {
        try {
            const token = store.getState().token;
            if (token) {
                let response: AxiosResponse<JwtRefreshResponse> =
                    await axios.post(`${AppSettings.API_ENDPOINT}/public/refreshtoken`,
                        {
                            refreshToken: token.refreshToken,
                        });
                const {accessToken, refreshToken, expiresIn} = response.data;

                this.scheduleTokenRefresh(expiresIn);
                store.dispatch(changeToken({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }));
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            store.dispatch(changeUser(null));
        }
    }

    scheduleTokenRefresh(expiresIn: number): void {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        const timeoutDuration = expiresIn - 60000;

        this.refreshTimeout = setTimeout(() => {
            this.doRefreshToken();
            console.log("refreshed");
            console.log(store.getState().token)
            store.dispatch(changeTokenInfo({
                tokenRefreshTimeoutDuration: timeoutDuration,
                tokenRefreshTimeoutStartTime: Date.now()
            }));
        }, timeoutDuration);
    }

    signout = async (afterLogout: () => void): Promise<void> => {
        store.dispatch(changeUser(null));
        store.dispatch(changeToken(null));
        store.dispatch(changeTokenInfo(null));
        try {
            await axiosInstance.get(`${AppSettings.API_ENDPOINT}/signout`);
            if (this.refreshTimeout) {
                clearTimeout(this.refreshTimeout);
            }
            // eslint-disable-next-line no-restricted-globals
            afterLogout();
        } catch (error) {
            console.log(error);
            afterLogout();
        }
    }

    async sendEmailPasswordRecovery(userEmail: string,
                                    onSuccess: (likedPoints: MapPoint[]) => void,
                                    onFailure: (error: any) => void): Promise<void> {
        try {
            let result = await axios
                .get(`${AppSettings.API_ENDPOINT}/public/passwordRecovery/sendEmail?userEmail=${userEmail}`);
            onSuccess(result.data);
        } catch (error) {
            console.log(error)
            onFailure(error as Error);
        }
    }

    async checkCodePasswordRecovery(userEmail: string,
                                    code: string,
                                    onSuccess: (isCorrectCode: boolean) => void,
                                    onFailure: (error: any) => void) {
        try {
            let result = await axios
                .get(`${AppSettings.API_ENDPOINT}/public/passwordRecovery/checkCode?userEmail=${userEmail}&code=${code}`);
            onSuccess(result.data);
        } catch (error) {
            console.log(error)
            onFailure(error as Error);
        }
    }

    async updatePasswordRecovery(userEmail: string,
                                 code: string,
                                 password: string,
                                 onSuccess: (isCorrectCode: boolean) => void,
                                 onFailure: (error: any) => void) {
        try {
            let result = await axiosInstance
                .get(`${AppSettings.API_ENDPOINT}/public/passwordRecovery/update?userEmail=${userEmail}&code=${code}&password=${password}`);
            onSuccess(result.data);
        } catch (error) {
            console.log(error)
            onFailure(error as Error);
        }
    }

    async isLoggedIn(accessToken: string): Promise<boolean> {
        try {
            const response: AxiosResponse<boolean> = await axios.get(`${AppSettings.API_ENDPOINT}/public/isLoggedIn?token=${accessToken}`);
            if (!response.data) store.dispatch(changeUser(null));
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    isAdmin(user: User): boolean {
        return user.roles.includes("ROLE_ADMIN");
    }
}

const authService = new AuthService();

export default authService;