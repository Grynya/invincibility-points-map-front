import axios, {AxiosResponse} from "axios";
import {AppSettings} from "../AppSettings";
import JwtResponse from "../model/JwtResponse";
import Cookies from "universal-cookie";
import {TokenRefreshResponse} from "../model/TokenRefreshResponse";

export class AuthService {
    async signin(loginRequest: { password: string | undefined; username: string | undefined}):Promise<JwtResponse>{
        console.log(loginRequest)
        let res: AxiosResponse = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/signin`, loginRequest);
        const cookies = new Cookies()
        cookies.set("accessToken", res.data.token, { httpOnly: true })
        cookies.set('refreshToken', res.data.refreshToken, { httpOnly: true });

        return res.data
    }

    async signup():Promise<JwtResponse>{
        let res: AxiosResponse = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/signin`);
        return res.data
    }

    async refreshtoken(tokenRefreshRequest: {refreshToken: string}):Promise<TokenRefreshResponse>{
        let res: AxiosResponse = await axios.post(`${AppSettings.API_ENDPOINT}/api/auth/refreshtoken`, tokenRefreshRequest);

        return res.data
    }
}