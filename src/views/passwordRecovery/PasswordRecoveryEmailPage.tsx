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
import {useNavigate} from "react-router-dom";
import authService from "../../service/AuthService";
import {changeError} from "../../store/actionCreators/changeError";
import {store} from "../../store/store";

export default function PasswordRecoveryEmailPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email) {
            await authService.sendEmailPasswordRecovery(email,
                () => navigate("/passwordRecoveryCode?userEmail="+email),
                error => store.dispatch(changeError(error.response.data.message)));
        } else store.dispatch(changeError("Відсутній email або пароль "));
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
                    <Typography variant={"subtitle1"} style={{color: "gray", textAlign: "center"}} sx={{mt: 1}}>
                        Лист з кодом підтвердження для відновлення паролю буде відправлений на цю електронну адресу
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3}}
                            disabled={!email}
                        >
                            Відправити
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </>
    )
}