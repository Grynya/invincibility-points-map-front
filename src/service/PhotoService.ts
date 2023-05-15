import {AppSettings} from "../AppSettings";
import store from "../store/store";
import axios from "axios";

class PhotoService {
    async createAll(createPhotosRequest: FormData, onSuccess: () => void, onFailure: (error: any) => void): Promise<number | undefined> {
        try {
            const token = store.getState().token;
            if (token && token.accessToken) {
                const headers = {
                    Authorization: `Bearer ${token.accessToken}`,
                    'Content-Type': 'multipart/form-data'
                };
                let res = await axios.post(`${AppSettings.API_ENDPOINT}/photo/createAll`, createPhotosRequest, {
                    headers
                });
                onSuccess();
                return res.status;
            }
        } catch (error) {
            onFailure(error)
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PhotoService();