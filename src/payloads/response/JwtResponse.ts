import {EUserStatus} from "../../model/EUserStatus";

export interface JwtResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    type: string;
    id: number;
    name: string;
    surname: string;
    email: string;
    code: string;
    userStatus: EUserStatus;
    roles: string[];

}