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
import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import Header from "../components/Header/Header";
import {useContext, useEffect} from "react";
import {gapi} from "gapi-script";
import {useNavigate} from "react-router-dom";
import {ProfileContext} from "../components/ProfileProvider";
import {useSelector} from "react-redux";
import {StoreState} from "../store/StoreState";

export default function RegistrationPage() {
    const {setProfile} = useContext(ProfileContext);
    const navigate = useNavigate();
    const clientId = useSelector((state: StoreState) => state.googleClientId);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email') as string,
            password: data.get('password') as string,
        });
    };
    const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ("profileObj" in res) {
            setProfile(res.profileObj);
        }
        navigate('/');
    };

    const onFailure = (err: any) => console.log('failed', err);

    useEffect(() => {
        const initClient = () => {
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    clientId: clientId
                });
            });
        };
        initClient();
    }, [clientId]);
    return (
        clientId !== null ?
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
                            <GoogleLogin
                                clientId={clientId}
                                buttonText="Увійти через Google"
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                                className={"google-btn-style"}
                            />
                        </Box>
                    </Box>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Container>
            </React.Fragment> : null
    );
}