import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../components/Header/Header";
import Copyright from "../components/Copyright";
import {useSelector} from "react-redux";
import {StoreState} from "../store/StoreState";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {AlertTitle, FormGroup, InputLabel} from "@mui/material";
import Loading from "../components/Loading";
import Button from "@mui/material/Button";
import {makeStyles} from "@material-ui/core/styles";
import CheckboxResources from "../components/resource/CheckboxResources"
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxSmall from "../components/Map/MapboxSmall";
import {TimePicker} from '@mui/x-date-pickers';
import {LngLatLike} from "mapbox-gl";
import Resource from "../model/Resource";
import CreatePointRequest from "../payloads/request/CreatePointRequest";
import dayjs, {Dayjs} from "dayjs";
import ErrorAlert from "../components/alerts/ErrorAlert";
import pointService from "../service/MapPointService";
import store from "../store/store";
import Alert from "@mui/material/Alert";
import {useNavigate} from "react-router-dom";

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
    const resources = useSelector((state: StoreState) => state.resources);
    const location: LngLatLike = useSelector((state: StoreState) => state.location);
    const [coordinates, setCoordinates] = useState<LngLatLike>();
    const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
    const [photos, setPhotos] = useState<FileList | null>(null);
    const classes = useStyles();
    const [success, setSuccess] = useState({message: "", visible: false});
    const [error, setError] = useState({message: "", visible: false});
    const user = store.getState().user;
    const [startDate, setStartDate] = useState<Dayjs>(dayjs('2022-04-17T00:00'));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs('2022-04-17T00:00'))
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreatePointRequest>({
        name: "",
        description: "",
        phone: "",
        userId: user ? user.id : null,
        coordinates: location,
        hoursOfWork: startDate.format("HH:mm") + '-' + endDate.format("HH:mm"),
        resources: selectedResources,
    });
    const isDisabledSubmitButton = (): boolean => formData.name === "" || formData.phone === "" || formData.userId === null
        || coordinates === null || false || formData.resources.length < 1

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formData)
        await pointService.createPoint(formData, photos, () => {
            console.log("Added mapPoint")
            setSuccess({message: "Пункт додано", visible: true})
        }, (error) => {
            if (error instanceof Error)
                setError({message: error.message, visible: true});
        });
    };

    useEffect(() => {
        setFormData({
            ...formData,
            hoursOfWork: startDate.format("HH:mm") + '-' + endDate.format("HH:mm"),
        });
    }, [startDate, endDate]);
    useEffect(() => {
        setFormData({
            ...formData,
            resources: selectedResources,
        });
    }, [selectedResources]);
    useEffect(() => {
        if (coordinates) {
            setFormData({
                ...formData,
                coordinates: coordinates,
            });
        }
    }, [coordinates])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setPhotos(event.target.files)
    }
    useEffect(() => setCoordinates(location), [location]);

    return (
        resources === null ? <Loading/> :
            <>
                <CssBaseline/>
                <Header open={false}/>
                <Container component="main" className="custom-cursor" maxWidth="xl">
                    <CssBaseline/>
                    <div
                        style={{
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
                            <ErrorAlert error={error} setError={setError}/>
                            {success.visible ?
                                <Alert severity={"success"} sx={{mt: 3, mb: 3}}>
                                    <AlertTitle><strong>{success.message}</strong></AlertTitle>
                                </Alert> : null}
                            <TextField
                                sx={{mt: 1, mb: 1}}
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Назва"
                                name="name"
                                autoComplete="name"
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                            />
                            <FormGroup sx={{mt: 1, mb: 1}}>
                                <InputLabel>Години роботи</InputLabel>
                                <div style={{display: "flex", paddingTop: 6}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            sx={{m: 0, p: 0, width: '50%'}}
                                            views={['hours', 'minutes']}
                                            format="HH:mm"
                                            value={startDate}
                                            label="Початок"
                                            onChange={(newValue) => {
                                                if (newValue) setStartDate(newValue)
                                            }}
                                        />
                                        <TimePicker
                                            sx={{
                                                margin: 0,
                                                p: 0,
                                                ml: 1,
                                                width: '50%'
                                            }}
                                            views={['hours', 'minutes']}
                                            format="HH:mm"
                                            value={endDate}
                                            label="Завершення"
                                            onChange={(newValue) => {
                                                if (newValue) setEndDate(newValue)
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </FormGroup>
                            <FormGroup sx={{mt: 1, mb: 1}}>
                                <InputLabel>Фото</InputLabel>
                                <input
                                    type="file"
                                    name="photo"
                                    id="photo"
                                    onChange={handleFileInputChange}
                                    accept='image/jpeg, image/png, image/gif'
                                    multiple
                                />
                            </FormGroup>
                            <CheckboxResources resources={resources}
                                               selectedResources={selectedResources}
                                               setSelectedResources={setSelectedResources}/>
                            <MapboxSmall coordinates={coordinates}
                                         setCoordinates={setCoordinates}/>
                            <Button
                                className={classes.root}
                                type="submit"
                                disabled={isDisabledSubmitButton()}
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{mt: 3}}
                            >
                                Додати пункт
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={navigate("/")}
                            >
                                На головну
                            </Button>
                        </Box>
                    </div>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Container>
            </>
    );
}