import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from "../../components/Copyright";
import Header from "../../components/Header/Header";
import AuthService from "../../service/AuthService";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import Alert from "@mui/material/Alert";
import {AlertTitle} from "@mui/material";

export default function RegistrationPage() {
    const [error, setError] = useState({message: "", visible: false});
    const [hiddenSuccess, setHiddenSuccess] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmedPassword: "",
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.name && formData.surname && formData.email && formData.password && formData.password === formData.confirmedPassword) {
            await AuthService.signup(
                {
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    password: formData.password
                },
                (error) => {
                    setError({message: error.response.data.message, visible: true});
                }, () => {
                    setHiddenSuccess(false);
                })
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevState) => ({...prevState, [name]: value}));
    };

    useEffect(() => {
        setDisabled(!(formData.name && formData.surname && formData.email && formData.password && formData.confirmedPassword === formData.password));
    }, [formData]);

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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar className="yellow-bg" sx={{m: 1}}>
                        <AppRegistrationIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Реєстрація
                    </Typography>
                    {hiddenSuccess ?
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            style={{marginTop: 1}}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Ім'я"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="surname"
                                label="Прізвище"
                                id="surname"
                                autoComplete="surname"
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
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
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmedPassword"
                                label="Підтвердіть пароль"
                                type="password"
                                id="confirmedPassword"
                                autoComplete="confirmed-password"
                                onChange={handleChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3}}
                                disabled={disabled}
                            >
                                Зареєструватись
                            </Button>
                            <ErrorAlert error={error} setError={setError}/>
                        </Box> : null}
                    {!hiddenSuccess ?
                        <Alert severity="success" sx={{mt: 3, mb: 3}}>
                            <AlertTitle>Лист з підтвердженням надіслано на електронну
                                пошту: {formData.email}</AlertTitle>
                            Перейдіть за посиланням у листі, щоб завершити створення профілю.
                        </Alert> : null}
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </React.Fragment>
    );
}