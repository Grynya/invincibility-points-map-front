import {AppSettings} from "../AppSettings";
import axios from 'axios';
import PointRequest from "../payloads/request/PointRequest";
import MapPoint from "../model/MapPoint"
import CreatePointRequest from "../payloads/request/CreatePointRequest";
class PointService {
    async getPoints(pointRequest: PointRequest):Promise<MapPoint[]>{
        let res= await axios.post(`${AppSettings.API_ENDPOINT}/public/point/getAll`, pointRequest);
        return res.data;
    }
    async createPoint(createPointRequest: CreatePointRequest):Promise<MapPoint[]>{
        let res= await axios.post(`${AppSettings.API_ENDPOINT}/public/point`, createPointRequest);
        return res.data;
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new PointService();