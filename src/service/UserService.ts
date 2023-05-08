import axios from "axios";
import {AppSettings} from "../AppSettings";
import MapPoint from "../model/MapPoint";

class UserService {
    async getLikedPoints(userId: number,
                         onSuccess: (likedPoints: MapPoint[]) => void,
                         onFailure: (error: any) => void): Promise<void> {
        try {
            let result = await axios.get(`${AppSettings.API_ENDPOINT}/user/likedPoints?&userId=${userId}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();