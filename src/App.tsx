import * as React from "react";
import {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./views/MainPage";
import LoginPage from "./views/auth/LoginPage";
import RegistrationPage from "./views/auth/RegistrationPage";
import {changeMapboxAccessToken} from "./store/actionCreators/changeMapboxAccessToken";
import {KeyService} from "./service/KeyService";
import CreatingPointPage from "./views/CreatingPointPage";
import {changeResources} from "./store/actionCreators/changeResources";
import {ResourceService} from "./service/ResourceService";
import {changeLocation} from "./store/actionCreators/changeLocation";
import ErrorVerificationPage from "./views/verification/ErrorVerificationPage";
import SuccessVerificationPage from "./views/verification/SuccessVerificationPage";
import LikedPointsPage from "./views/likedPoints/LikedPointsPage";
import PasswordRecoveryEmailPage from "./views/passwordRecovery/PasswordRecoveryEmailPage";
import PasswordRecoveryCodePage from "./views/passwordRecovery/PasswordRecoveryCodePage";
import PasswordRecoveryUpdatingPage from "./views/passwordRecovery/PasswordRecoveryUpdatingPage";
import {store} from "./store/store";
import UsersPage from "./views/UsersPage";
import ProtectedUserRoute from "./protectedRoute/ProtectedUserRoute";
import ProtectedAdminRoute from "./protectedRoute/ProtectedAdminRoute";
import {changeError} from "./store/actionCreators/changeError";

export default function App() {
    function successLocation(position: any) {
        const {longitude, latitude} = position.coords;
        store.dispatch(changeLocation([longitude, latitude]))
    }

    const errorLocation = () => store.dispatch(changeError( "Не вдалося встановити поточне місцезнаходження"));

    useEffect(() => {
        const fetchData = async () => {
            await new KeyService().getKeys(async (result) => {
                store.dispatch(changeMapboxAccessToken(result.mapboxAccessToken));
                await new ResourceService().getResources(
                    resources => store.dispatch(changeResources(resources)),
                    () => console.log("Unable to load resources")
                );
            }, error => {
                console.log(error.message);
                store.dispatch(changeError("Не вдалося завантажити мапу"))
            });
        };
        fetchData();
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true
        });
    });
    return (<React.Fragment>
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
                    <Route path="/addpoint" element={<ProtectedUserRoute/>}>
                        <Route path="/addpoint" element={<CreatingPointPage/>}/>
                    </Route>
                    <Route path="/likedPoints" element={<ProtectedUserRoute/>}>
                        <Route path="/likedPoints" element={<LikedPointsPage/>}/>
                    </Route>
                    <Route path="/users" element={<ProtectedAdminRoute/>}>
                        <Route path="/users" element={<UsersPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    )
}