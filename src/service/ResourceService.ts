import {AppSettings} from "../AppSettings";
import Resource from "../model/Resource";
import axiosInstance from "./axiosInstance";

export class ResourceService {
    async getResources():Promise<Resource[]>{
        let res= await axiosInstance.get(`${AppSettings.API_ENDPOINT}/public/resource`);
        return res.data
    }
}