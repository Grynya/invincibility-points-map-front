import {AppSettings} from "../AppSettings";
import axios from 'axios';

class PhotoService {
    async createAll(createPhotosRequest: FormData, onSuccess: () => void, onFailure: (error: any) => void):Promise<number|undefined> {
        try {
            let res = await axios.post(`${AppSettings.API_ENDPOINT}/photo/createAll`, createPhotosRequest, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSuccess();
            return res.status;
        } catch (error) {
            onFailure(error)
        }
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PhotoService();