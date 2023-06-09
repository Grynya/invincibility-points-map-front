import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../../components/header/Header";
import Copyright from "../../components/Copyright";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthService from "../../service/AuthService";
import {HttpStatusCode} from "axios";
import {store} from "../../store/store";
import {changeError} from "../../store/actionCreators/changeError";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username && password) {
            await AuthService.signin(username, password, (error) => {
                (error.response.status === HttpStatusCode.Unauthorized) ?
                    store.dispatch(changeError( "Не правильно вказаний логін або пароль")) :
                    store.dispatch(changeError(error.response.data.message));
            }, () => navigate("/"));
        } else store.dispatch(changeError("Не вказано логін або пароль"));
    }

    return (
        <>
            <CssBaseline/>
            <Header open={false}/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    component="div"
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar className="yellow-bg" sx={{m: 1}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Вхід
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3}}
                            disabled={!username || !password}
                        >
                            Увійти
                        </Button>
                        <Grid container sx={{mt: 3}}>
                            <Grid item xs>
                                <Link href="/passwordRecovery" variant="body2">
                                    Забули пароль?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/registration" variant="body2">
                                    {"Зареєструватись"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </>
    )
}