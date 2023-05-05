import * as React from 'react';
import {useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {useNavigate} from "react-router-dom";
import Header from "../../components/Header/Header";
import {Alert, AlertTitle} from '@mui/material';
import authService from "../../service/AuthService";
import Button from "@mui/material/Button";

export default function SuccessVerificationPage() {
    const navigate = useNavigate();
    const [hiddenError, setHiddenError] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const name = searchParams.get('name');
        const surname = searchParams.get('surname');
        const email = searchParams.get('email');
        const userStatus = searchParams.get('userStatus');
        const isAdmin = searchParams.get('isAdmin');
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const expiresIn = searchParams.get('expiresIn');

        if (accessToken && refreshToken && expiresIn) {
            localStorage.setItem("user", JSON.stringify({
            name: name,
            surname: surname,
            email: email,
            userStatus: userStatus,
            isAdmin: isAdmin
        }));
        console.log(refreshToken)

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            authService.scheduleTokenRefresh(parseInt(expiresIn));
            navigate("/");
        } else setHiddenError(true)
    }, []);


    return (
        <>
            <Header open={false}/>
            <CssBaseline/>
            <Container component="main" maxWidth="xs">
                <Alert severity="success" sx={{mt: 3, mb: 3}}>
                    <AlertTitle>Акаунт активовано</AlertTitle>
                </Alert>
                <Alert severity="error" sx={{mt: 3, mb: 3}} hidden={hiddenError}>
                    <AlertTitle>Помилка авторизації</AlertTitle>
                </Alert>
                <Button
                    hidden={hiddenError}
                    fullWidth
                    variant="contained"
                    href="/login"
                >
                    Увійти
                </Button>
            </Container>
        </>
    )
}