import * as React from "react";
import {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./views/MainPage";
import LoginPage from "./views/LoginPage";
import RegistrationPage from "./views/RegistrationPage";
import {useDispatch} from "react-redux";
import {ProfileProvider} from './components/ProfileProvider';
import {changeMapboxAccessToken} from "./store/actionCreators/changeMapboxAccessToken";
import {KeyService} from "./service/KeyService";
import Keys from "./model/Keys";
import CreatingPointPage from "./views/CreatingPointPage";
import {changeResources} from "./store/actionCreators/changeResources";
import {ResourceService} from "./service/ResourceService";
import {changeLocation} from "./store/actionCreators/changeLocation";
import ErrorVerificationPage from "./views/verification/ErrorVerificationPage";
import SuccessVerificationPage from "./views/verification/SuccessVerificationPage";

export default function App() {
    const dispatch = useDispatch();

    function successLocation(position:any) {
        const { longitude, latitude } = position.coords;
        dispatch(changeLocation([longitude, latitude]))
    }
    function errorLocation() {
        console.log("Unable to get current location.")
    }
    useEffect(() => {
        const fetchData = async () => {
            const data: Keys = await new KeyService().getKeys();
            const resources = await new ResourceService().getResources();
            dispatch(changeMapboxAccessToken(data.mapboxAccessToken));
            dispatch(changeResources(resources));
            if (!localStorage.getItem("tokenRefreshTimeoutDuration")
                && !localStorage.getItem("tokenRefreshTimeoutStartTime"))
                localStorage.clear();
        };
        fetchData();
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true
        });
    });
    return (
        <ProfileProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/errorVerification" element={<ErrorVerificationPage/>}/>
                    <Route path="/successVerification" element={<SuccessVerificationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/registration" element={<RegistrationPage/>}/>
                    <Route path="/addpoint" element={<CreatingPointPage/>}/>
                </Routes>
            </BrowserRouter>
        </ProfileProvider>
    )
}