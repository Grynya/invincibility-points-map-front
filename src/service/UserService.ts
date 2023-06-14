import {AppSettings} from "../AppSettings";
import MapPoint from "../model/MapPoint";
import axiosInstance from "../axiosInstance";
import User from "../model/User";

class UserService {
    async getAllUsers(onSuccess: (users: User[]) => void,
                      onFailure: (error: any) => void): Promise<void> {
        try {
            let result =
                await axiosInstance
                    .get(`${AppSettings.API_ENDPOINT}/admin/getAllUsers`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }

    async getLikedPoints(userId: number,
                         onSuccess: (likedPoints: MapPoint[]) => void,
                         onFailure: (error: any) => void): Promise<void> {
        try {
            let result =
                await axiosInstance
                    .get(`${AppSettings.API_ENDPOINT}/user/likedPoints?userId=${userId}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();