import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";

const isAccessTokenExpired = () => {
    const cookies = new Cookies();

    const accessToken = jwt_decode(cookies.get("accessToken"));
    const decoded: any = accessToken;
    const expirationTime = decoded.exp;
    if (!expirationTime || !accessToken) {
        return true;
    }
    return Date.now() > new Date(expirationTime).getTime();
};
export default isAccessTokenExpired