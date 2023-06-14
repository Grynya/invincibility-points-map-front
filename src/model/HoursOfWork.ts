export default class HoursOfWork{
    startTime:string;
    endTime:string;

    constructor(startTime: string, endTime: string) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
    static split (hoursOfWork: HoursOfWork):string {
        return hoursOfWork.startTime+" - "+hoursOfWork.endTime;
    }
}