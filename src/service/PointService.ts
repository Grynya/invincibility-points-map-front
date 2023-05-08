import {AppSettings} from "../AppSettings";
import axios from 'axios';
import PointRequest from "../payloads/request/PointRequest";
import MapPoint from "../model/MapPoint"
import CreatePointRequest from "../payloads/request/CreatePointRequest";
import {CreatePointResponse} from "../payloads/response/CreatePointResponse";
import photoService from "./PhotoService";

class PointService {
    async getPoints(pointRequest: PointRequest): Promise<MapPoint[]> {
        return (await axios.post(`${AppSettings.API_ENDPOINT}/public/point/getAll`, pointRequest)).data;
    }

    async createPoint(createPointRequest: CreatePointRequest,
                      photos: FileList | null,
                      onSuccess: () => void,
                      onFailure: (error: any) => void): Promise<void> {
        try {
            if (!createPointRequest.userId) {
                console.log("User id is null");
                return;
            }
            let createPointResponse: CreatePointResponse = await axios.post(`${AppSettings.API_ENDPOINT}/point`,
                createPointRequest);
            console.log(createPointResponse)
            const dataToSavePhotos = new FormData();
            dataToSavePhotos.append("mapPointId", createPointResponse.data.mapPointId.toString())
            console.log(photos)
            if (photos) {
                for (let i = 0; i < photos.length; i++) {
                    dataToSavePhotos.append("photos", photos[i]);
                }
                onSuccess();
                await photoService.createAll(dataToSavePhotos, () => {
                    console.log("Added all photos");
                }, onFailure);
            } else onSuccess();
        } catch (error) {
            onFailure(error);
        }
    }
    async like(pointId: number,
               userId: number,
               onSuccess: () => void,
               onFailure: (error: any) => void): Promise<void>{
        try {
            console.log(await axios.get(`${AppSettings.API_ENDPOINT}/point/like?pointId=${pointId}&userId=${userId}`));
            onSuccess()
        } catch (error) {
            onFailure(error);
        }
    }
    async unlike(pointId: number, userId: number,
               onSuccess: () => void,
               onFailure: (error: any) => void): Promise<void>{
        try {
            console.log(
                await axios.get(`${AppSettings.API_ENDPOINT}/point/unlike?pointId=${pointId}&userId=${userId}`));
            onSuccess()
        } catch (error) {
            onFailure(error);
        }
    }

    async isLiked(pointId: number, userId: number,
                 onSuccess: (isLiked: boolean) => void,
                 onFailure: (error: any) => void): Promise<void>{
        try {
            let result = await axios.get(`${AppSettings.API_ENDPOINT}/point/isLiked?pointId=${pointId}&userId=${userId}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error);
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PointService();