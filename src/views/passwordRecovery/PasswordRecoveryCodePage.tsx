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

export default function PasswordRecoveryCodePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('userEmail');
    const [error, setError] = useState({message: "", visible: false});
    const [code, setCode] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (code) {
            await authService.checkCodePasswordRecovery(email!, code, () => {
                navigate(`/passwordRecoveryUpdate?userEmail=${email}&code=${code}`);
            }, (error) => {
                setError({message: error.response.data.message, visible: true});
            })
        } else {
            setError({message: "No email or password", visible: true});
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
                    <Typography variant={"subtitle1"} style={{color: "gray", textAlign: "center"}} sx={{mt: 1}}>
                        Введіть код з листа
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="code"
                            label="Код"
                            name="code"
                            autoComplete="code"
                            autoFocus
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3}}
                            disabled={!code}
                        >
                            Відправити
                        </Button>
                        <ErrorAlert error={error} setError={setError}/>
                        <Alert severity={"success"} sx={{mt: 3, mb: 3}}>
                            <AlertTitle><strong>Перевірте пошту</strong></AlertTitle>
                            Лист з кодом підтвердження для відновлення паролю відправлено.
                        </Alert>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </>
    )
}