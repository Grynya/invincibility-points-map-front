import Keys from "../model/Keys";
import {AppSettings} from "../AppSettings";
import axiosInstance from "../axiosInstance";

export class KeyService {
    async getKeys(onSuccess: (result: Keys) => void,
                   onFailure: (error: Error) => void):Promise<void>{
        try {
            let res = await axiosInstance.get(`${AppSettings.API_ENDPOINT}/public/keys`);
            onSuccess(res.data);
        } catch (error) {
            onFailure(error as Error);
        }
    }
}