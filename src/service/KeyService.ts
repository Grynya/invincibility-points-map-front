import Keys from "../model/Keys";
import {AppSettings} from "../AppSettings";
import axiosInstance from "./axiosInstance";

export class KeyService {
    async getKeys():Promise<Keys>{
        let res= await axiosInstance.get(`${AppSettings.API_ENDPOINT}/public/keys`);
        return res.data
    }
}