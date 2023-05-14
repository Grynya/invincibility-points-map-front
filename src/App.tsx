import * as React from "react";
import {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./views/MainPage";
import LoginPage from "./views/auth/LoginPage";
import RegistrationPage from "./views/auth/RegistrationPage";
import {useDispatch} from "react-redux";
import {changeMapboxAccessToken} from "./store/actionCreators/changeMapboxAccessToken";
import {KeyService} from "./service/KeyService";
import Keys from "./model/Keys";
import CreatingPointPage from "./views/CreatingPointPage";
import {changeResources} from "./store/actionCreators/changeResources";
import {ResourceService} from "./service/ResourceService";
import {changeLocation} from "./store/actionCreators/changeLocation";
import ErrorVerificationPage from "./views/verification/ErrorVerificationPage";
import SuccessVerificationPage from "./views/verification/SuccessVerificationPage";
import LikedPointsPage from "./views/LikedPointsPage";
import PasswordRecoveryEmailPage from "./views/password_recovery/PasswordRecoveryEmailPage";
import PasswordRecoveryCodePage from "./views/password_recovery/PasswordRecoveryCodePage";
import PasswordRecoveryUpdatingPage from "./views/password_recovery/PasswordRecoveryUpdatingPage";

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
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/errorVerification" element={<ErrorVerificationPage/>}/>
                    <Route path="/successVerification" element={<SuccessVerificationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/registration" element={<RegistrationPage/>}/>
                    <Route path="/passwordRecovery" element={<PasswordRecoveryEmailPage/>}/>
                    <Route path="/passwordRecoveryCode" element={<PasswordRecoveryCodePage/>}/>
                    <Route path="/passwordRecoveryUpdate" element={<PasswordRecoveryUpdatingPage/>}/>
                    <Route path="/addpoint" element={<CreatingPointPage/>}/>
                    <Route path="/likedPoints" element={<LikedPointsPage/>}/>
                </Routes>
            </BrowserRouter>
    )
}