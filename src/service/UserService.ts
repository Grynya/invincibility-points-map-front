import axios from "axios";
import {AppSettings} from "../AppSettings";
import MapPoint from "../model/MapPoint";

class UserService {
    async getLikedPoints(userId: number,
                         onSuccess: (likedPoints: MapPoint[]) => void,
                         onFailure: (error: any) => void): Promise<void> {
        try {
            let result = await axios.get(`${AppSettings.API_ENDPOINT}/user/likedPoints?userId=${userId}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }

    async sendEmailPasswordRecovery(userEmail: string,
                                    onSuccess: (likedPoints: MapPoint[]) => void,
                                    onFailure: (error: any) => void): Promise<void> {
        try {
            let result = await axios
                .get(`${AppSettings.API_ENDPOINT}/user/passwordRecovery/sendEmail?userEmail=${userEmail}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }

    async checkCodePasswordRecovery(userEmail: string,
                                    code: string,
                                    onSuccess: (isCorrectCode: boolean) => void,
                                    onFailure: (error: any) => void) {
        try {
            let result = await axios
                .get(`${AppSettings.API_ENDPOINT}/user/passwordRecovery/checkCode?userEmail=${userEmail}&code=${code}`);
            console.log(result);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }

    async updatePasswordRecovery(userEmail: string,
                                 code: string,
                                 password: string,
                                 onSuccess: (isCorrectCode: boolean) => void,
                                 onFailure: (error: any) => void) {
        try {
            let result = await axios
                .get(`${AppSettings.API_ENDPOINT}/user/passwordRecovery/update?userEmail=${userEmail}&code=${code}&password=${password}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();