import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../../components/Header/Header";
import Copyright from "../../components/Copyright";
import {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {FormGroup, InputLabel} from "@mui/material";
import Loading from "../../components/Loading";
import Button from "@mui/material/Button";
import {makeStyles} from "@material-ui/core/styles";
import CheckboxResources from "./CheckboxResources"

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: "blue",
        color: "white",
        "&:hover": {
            backgroundColor: "darkblue",
        },
    },
}));
export default function CreatingPointPage() {
    const clientId = useSelector((state: StoreState) => state.googleClientId);
    const resources = useSelector((state: StoreState) => state.resources);
    const classes = useStyles();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        // if ("profileObj" in res) {
        //     setProfile(res.profileObj);
        // }
        // navigate('/');
    };

    const onFailure = (err: any) => {
        console.log('failed', err);
    };

    return (
        clientId === null || resources === null ? <Loading/> :
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
                            <AddLocationIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Створення нового пункту
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                sx={{mt: 1, mb: 1}}
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Назва"
                                name="name"
                                autoComplete="name"
                                autoFocus
                            />
                            <TextField
                                sx={{mt: 1, mb: 1}}
                                margin="normal"
                                required
                                fullWidth
                                name="description"
                                multiline
                                maxRows={6}
                                label="Опис"
                                id="description"
                                autoComplete="description"
                            />
                            <TextField
                                sx={{mt: 1, mb: 1}}
                                margin="normal"
                                required
                                fullWidth
                                name="phone"
                                label="Телефон"
                                id="phone"
                                autoComplete="phone"
                            />
                            <TextField
                                sx={{mt: 1, mb: 1}}
                                margin="normal"
                                required
                                fullWidth
                                name="address"
                                label="Адреса"
                                id="address"
                                autoComplete="address"
                            />
                            <FormGroup>
                                <InputLabel>Години роботи</InputLabel>
                                <div style={{display: "flex", paddingTop:5}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            sx={{m: 0, p: 0}}
                                            label="Початок"
                                            views={["hours"]}
                                            format="hh"
                                        />
                                        <TimePicker
                                            sx={{
                                                margin: 0,
                                                p: 0,
                                                ml: 1
                                            }}
                                            label="Завершення"
                                            views={["hours"]}
                                            format="hh"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </FormGroup>
                            <CheckboxResources resources={resources}/>
                            <Button
                                className={classes.root}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{mt: 3}}
                            >
                                Додати пункт
                            </Button>
                        </Box>
                    </Box>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Container>
            </>
    );
}