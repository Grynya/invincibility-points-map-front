import {AppSettings} from "../AppSettings";
import Resource from "../model/Resource";
import axiosInstance from "../axiosInstance";

export class ResourceService {
    async getResources(onSuccess: (result: Resource[]) => void,
                       onFailure: (error: Error) => void):Promise<void>{
        try {
            let res = await axiosInstance.get(`${AppSettings.API_ENDPOINT}/public/resource`);
            onSuccess(res.data);
        } catch (error) {
            onFailure(error as Error);
        }
    }
}