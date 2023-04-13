import {AppSettings} from "../AppSettings";
import axios from 'axios';
import PointRequest from "../model/PointRequest";
import MapPoint from "../model/MapPoint"
class PointService {
    async getPoints(pointRequest: PointRequest):Promise<MapPoint[]>{
        let res= await axios.post(`${AppSettings.API_ENDPOINT}/public/point`, pointRequest);
        return res.data;
    }

}
// eslint-disable-next-line import/no-anonymous-default-export
export default new PointService();