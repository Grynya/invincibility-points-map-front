import {AxiosResponse} from "axios";
import {AppSettings} from "../AppSettings";
import MapPoint from "../model/MapPoint";
import {JwtResponse} from "../payloads/response/JwtResponse";
import {store} from "../store/store";
import {changeUser} from "../store/actionCreators/changeUser";
import axiosInstance from "./axiosInstance";

class UserService {
    async setUserByAccessToken(accessToken: string, onFailure: (error: any) => void,
                               onSuccess: () => void): Promise<void> {
        try {
            const response: AxiosResponse<JwtResponse> =
                await axiosInstance
                    .get(`${AppSettings.API_ENDPOINT}/user/info-by-access-token?accessToken=${accessToken}`);
            const {id, name, surname, email, userStatus, roles} = response.data;
            store.dispatch(changeUser({id, name, surname, email, userStatus, roles}))
            onSuccess();
        } catch (error) {
            onFailure(error)
        }
    }

    async getLikedPoints(userId: number,
                         onSuccess: (likedPoints: MapPoint[]) => void,
                         onFailure: (error: any) => void): Promise<void> {
        try {
            let result =
                await axiosInstance
                    .get(`${AppSettings.API_ENDPOINT}/user/likedPoints?userId=${userId}`);
            console.log(result)
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();