import axios, {AxiosResponse} from "axios/index";
import Keys from "../interfaces/Keys";
import {AppSettings} from "../AppSettings";

export class UserService {
    async createUser():Promise<Keys>{
        let res: AxiosResponse = await axios.post(`${AppSettings.API_ENDPOINT}/user`);
        return res.data
    }
}