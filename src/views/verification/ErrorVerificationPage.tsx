import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import Header from "../../components/header/Header";
import {Alert, AlertTitle} from '@mui/material';
import {useEffect, useState} from "react";

export default function ErrorVerificationPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('errorMessage');
    const [error, setError] = useState<string>();
    useEffect(() => {
        console.log(errorMessage)
        if (errorMessage === "TOKEN_EXPIRED") {
            setError("Термін дії токена минув");
        } else if (errorMessage === "TOKEN_INVALID") {
            setError("Токен не дійсний");
        } else {
            setError("Не вдалося активувати акаунт");
        }
    }, [errorMessage]);

    return (
        <>
            <Header open={false}/>
            <CssBaseline/>
            <Container component="main" maxWidth="xs">
                <Alert severity="error" sx={{mt: 3, mb: 3}}>
                    <AlertTitle>Помилка активації акаунту</AlertTitle>
                    <strong>{error}</strong>
                </Alert>
                <Button
                    fullWidth
                    variant="contained"
                    href="/"
                >
                    На головну
                </Button>
            </Container>
        </>
    )
}