import * as React from 'react';
import {useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {useNavigate} from "react-router-dom";
import Header from "../../components/Header/Header";
import {Alert, AlertTitle} from '@mui/material';
import authService from "../../service/AuthService";
import Button from "@mui/material/Button";
import userService from "../../service/UserService";
import {store} from "../../store/store";
import {changeToken} from "../../store/actionCreators/changeToken";

export default function SuccessVerificationPage() {
    const navigate = useNavigate();
    const [showedError, setShowedError] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const expiresIn = searchParams.get('expiresIn');

        if (accessToken && refreshToken && expiresIn) {
            store.dispatch(changeToken({accessToken, refreshToken}))

            authService.scheduleTokenRefresh(parseInt(expiresIn));

            userService.setUserByAccessToken(accessToken, () => {
                setShowedError(true)
            }, () => {
                navigate("/");
            })
        } else setShowedError(true);
    }, []);


    return (
        <>
            <Header open={false}/>
            <CssBaseline/>
            <Container component="main" maxWidth="xs">
                <Alert severity="success" sx={{mt: 3, mb: 3}}>
                    <AlertTitle>Акаунт активовано</AlertTitle>
                </Alert>
                {showedError ?
                    <div>
                        <Alert severity="error" sx={{mt: 3, mb: 3}} hidden={showedError}>
                            <AlertTitle>Помилка авторизації</AlertTitle>
                        </Alert>
                        <Button
                            fullWidth
                            variant="contained"
                            href="/login"
                        >
                            Увійти
                        </Button>
                    </div>
                    : null}

            </Container>
        </>
    )
}