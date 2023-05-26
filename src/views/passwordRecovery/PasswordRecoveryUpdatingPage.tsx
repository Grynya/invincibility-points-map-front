import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../../components/header/Header";
import Copyright from "../../components/Copyright";
import {useLocation, useNavigate} from "react-router-dom";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import Alert from "@mui/material/Alert";
import {AlertTitle} from "@mui/material";
import authService from "../../service/AuthService";

export default function PasswordRecoveryUpdatingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const email = searchParams.get('userEmail');
    const [success, setSuccess] = useState({message: "", visible: false});
    const [error, setError] = useState({message: "", visible: false});
    const [formData, setFormData] = useState({password: "", confirmedPassword: ""});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.password) {
            await authService.updatePasswordRecovery(email!, code!, formData.password, () => {
                setSuccess({message: "Пароль оновлено", visible: true});
            }, (error) => {
                setError({message: error.response.data.message, visible: true});
            })
        } else {
            setError({message: "No password", visible: true});
        }
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
                    Відновлення паролю
                </Typography>
                {!success.visible ?
                    <React.Fragment>
                        <Typography variant={"subtitle1"} style={{color: "gray", textAlign: "center"}} sx={{mt: 1}}>
                            Введіть новий пароль
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Новий пароль"
                                name="password"
                                autoComplete="password"
                                autoFocus
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Підтвердіть новий пароль"
                                name="email"
                                autoComplete="email"
                                value={formData.confirmedPassword}
                                onChange={(e) => setFormData({...formData, confirmedPassword: e.target.value})}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3}}
                                disabled={!formData.password || !formData.confirmedPassword ||
                                    formData.password !== formData.confirmedPassword}
                            >
                                Відправити
                            </Button>
                        </Box>
                    </React.Fragment>:null}
                <ErrorAlert error={error} setError={setError}/>
                {success.visible ?
                    <React.Fragment>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/login")}
                            sx={{mt: 3}}>
                            Увійти
                        </Button>
                        <Alert sx={{mt: 3}}>
                            <AlertTitle>{success.message}</AlertTitle>
                        </Alert>
                    </React.Fragment> : null}
        </Box>
        <Copyright sx={{mt: 8, mb: 4}}/>
        </Container>
</>
)
}