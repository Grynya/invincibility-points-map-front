import {AppSettings} from "../AppSettings";
import axios from 'axios';
import PointRequest from "../payloads/request/PointRequest";
import MapPoint from "../model/MapPoint"
import CreatePointRequest from "../payloads/request/CreatePointRequest";
import {CreatePointResponse} from "../payloads/response/CreatePointResponse";
import photoService from "./PhotoService";

class PointService {
    async getPoints(pointRequest: PointRequest): Promise<MapPoint[]> {
        let res = await axios.post(`${AppSettings.API_ENDPOINT}/public/point/getAll`, pointRequest);
        return res.data;
    }

    async createPoint(createPointRequest: CreatePointRequest, photos: FileList | null, onSuccess: () => void, onFailure: (error: any) => void): Promise<void> {
        try {
            let createPointResponse: CreatePointResponse = await axios.post(`${AppSettings.API_ENDPOINT}/point`, createPointRequest);
            console.log(createPointResponse)
            const dataToSavePhotos = new FormData();
            dataToSavePhotos.append("mapPointId", createPointResponse.body.mapPointId)
            if (photos) {
                for (let i = 0; i < photos.length; i++) {
                    dataToSavePhotos.append("photos", photos[i]);
                }
                onSuccess();
                await photoService.createAll(dataToSavePhotos, ()=>{
                    console.log("Added all photos");
                }, onFailure);
            } else onSuccess();
        } catch (error) {
            onFailure(error);
        }
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PointService();