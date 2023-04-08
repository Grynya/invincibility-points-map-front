import {EUserStatus} from "./EUserStatus";

export default interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    code: string;
    status: EUserStatus;

}