import {AppSettings} from "../AppSettings";
import axios from 'axios';
import Resource from "../interfaces/Resource";

export class ResourceService {
    async getResources():Promise<Resource[]>{
        let res= await axios.get(`${AppSettings.API_ENDPOINT}/public/resource`);
        return res.data
    }
}