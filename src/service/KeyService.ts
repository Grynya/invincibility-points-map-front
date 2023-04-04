import Keys from "../interfaces/Keys";
import {AppSettings} from "../AppSettings";
import axios from 'axios';

export class KeyService {
    async getKeys():Promise<Keys>{
        let res= await axios.get(`${AppSettings.API_ENDPOINT}/keys`);
        return res.data
    }
}