import {AppSettings} from "../AppSettings";
import MapPointRequest from "../payloads/request/MapPointRequest";
import MapPoint from "../model/MapPoint"
import CreatePointRequest from "../payloads/request/CreatePointRequest";
import {CreatePointResponse} from "../payloads/response/CreatePointResponse";
import photoService from "./PhotoService";
import {ERating} from "../model/ERating"
import axiosInstance from "../axiosInstance";
import {RatingResponse} from "../payloads/response/RatingResponse";

class MapPointService {
    async getPoints(mapPointRequest: MapPointRequest,
                    onSuccess: (points: MapPoint[]) => void,
                    onFailure: (error: Error) => void): Promise<void> {
        try {
            onSuccess((await axiosInstance
                .post(`${AppSettings.API_ENDPOINT}/public/point/getAll`, mapPointRequest)).data);
        } catch (error) {
            onFailure(error as Error);
        }
    }

    async getPointsByUser(userId: number,
                          onSuccess: (points: MapPoint[]) => void,
                          onFailure: (error: Error) => void): Promise<void> {
        try {
            onSuccess((await axiosInstance.get(`${AppSettings.API_ENDPOINT}/point/getAllByUser?userId=${userId}`)).data)
        } catch (error) {
            onFailure(error as Error);
        }
    }

    async createPoint(createPointRequest: CreatePointRequest,
                      photos: FileList | null,
                      onSuccess: () => void,
                      onFailure: (error: Error) => void): Promise<void> {
        try {
            if (!createPointRequest.userId) {
                return;
            }
            let createPointResponse: CreatePointResponse =
                await axiosInstance.post(`${AppSettings.API_ENDPOINT}/point`, createPointRequest);
            const dataToSavePhotos = new FormData();
            dataToSavePhotos.append("mapPointId", createPointResponse.data.mapPointId.toString())
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
            onFailure(error as Error);
        }
    }

    async rate(pointId: number,
               userId: number,
               rating: ERating,
               onSuccess: () => void,
               onFailure: (error: Error) => void): Promise<void> {
        try {
            await axiosInstance.post(`${AppSettings.API_ENDPOINT}/point/rate`,
                {pointId, userId, rating},);
            onSuccess()
        } catch (error) {
            onFailure(error as Error);
        }
    }

    async getRating(pointId: number, userId: number,
                    onSuccess: (rating: RatingResponse) => void,
                    onFailure: (error: Error) => void): Promise<void> {
        try {
            let result =
                await axiosInstance
                    .get(`${AppSettings.API_ENDPOINT}/point/getRating?mapPointId=${pointId}&userId=${userId}`);
            onSuccess(result.data);
        } catch (error) {
            onFailure(error as Error);
        }
    }

    async deleteMapPoint(pointId: number,
                         onSuccess: () => void,
                         onFailure: (error: Error) => void) {
        try {
            await axiosInstance.delete(`${AppSettings.API_ENDPOINT}/admin/point?pointId=${pointId}`);
            onSuccess();
        } catch (error) {
            onFailure(error as Error);
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new MapPointService();