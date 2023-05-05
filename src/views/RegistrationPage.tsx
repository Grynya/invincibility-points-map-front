import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from "../components/Copyright";
import Header from "../components/Header/Header";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import AuthService from "../service/AuthService";
import ErrorAlert from "../components/alerts/ErrorAlert";

export default function RegistrationPage() {
    const navigate = useNavigate();
    const [error, setError] = useState({message: "", visible: false});
        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const username = formData.get('email')?.toString();
            const password = formData.get('password')?.toString();
            if (username !== undefined && password !== undefined) {
                await AuthService.login(username, password, (error) => {
                    setError({message: error.response.data.message, visible: true});
                }, ()=>{
                    navigate("/");
                })
            } else setError({message: "No username or password", visible: true});
        }

    return (
        <React.Fragment>
            <CssBaseline/>
            <Header open={false}/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    component="div"
                    style={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar style={{margin: 1, backgroundColor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Реєстрація
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate style={{marginTop: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3}}
                        >
                            Зареєструватись
                        </Button>
                        <ErrorAlert error={error} setError={setError}/>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </React.Fragment>
    );
}