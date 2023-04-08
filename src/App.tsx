import * as React from "react";
import {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./views/MainPage";
import LoginPage from "./views/LoginPage";
import RegistrationPage from "./views/RegistrationPage";
import {useDispatch} from "react-redux";
import {ProfileProvider} from './components/ProfileProvider';
import {changeMapboxAccessToken} from "./store/actionCreators/changeMapboxAccessToken";
import {changeGoogleClientId} from "./store/actionCreators/changeGoogleClientId";
import {KeyService} from "./service/KeyService";
import Keys from "./model/Keys";
import CreatingPointPage from "./views/creatingPoint/CreatingPointPage";
import {changeResources} from "./store/actionCreators/changeResources";
import {ResourceService} from "./service/ResourceService";
import Cookies from "universal-cookie";
import {AuthService} from "./service/AuthService";
import isAccessTokenExpired from "./helpers/isAccessTokenExpired";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const cookies = new Cookies();

        if (isAccessTokenExpired()) {
            new AuthService().refreshtoken(cookies.get('refreshToken')).then(res => {
                const {accessToken, refreshToken} = res;
                cookies.set('accessToken', accessToken, {httpOnly: true});
                cookies.set('refreshToken', refreshToken, {httpOnly: true});
            });
        }

        const fetchData = async () => {
            const data: Keys = await new KeyService().getKeys();
            const resources = await new ResourceService().getResources();
            dispatch(changeMapboxAccessToken(data.mapboxAccessToken));
            dispatch(changeGoogleClientId(data.googleClientId));
            dispatch(changeResources(resources));
        };
        fetchData();
    });
    return (
        <ProfileProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/registration" element={<RegistrationPage/>}/>
                    <Route path="/addpoint" element={<CreatingPointPage/>}/>
                </Routes>
            </BrowserRouter>
        </ProfileProvider>
    )
}