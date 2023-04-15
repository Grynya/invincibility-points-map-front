import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../../components/Header/Header";
import Copyright from "../../components/Copyright";
import {useSelector} from "react-redux";
import {StoreState} from "../../store/StoreState";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {FormGroup, InputLabel} from "@mui/material";
import Loading from "../../components/Loading";
import Button from "@mui/material/Button";
import {makeStyles} from "@material-ui/core/styles";
import CheckboxResources from "./CheckboxResources"
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxSmall from "../../components/Map/MapboxSmall";
import {TimePicker} from '@mui/x-date-pickers';
import {LngLatLike} from "mapbox-gl";
import Resource from "../../model/Resource";

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
    const location = useSelector((state: StoreState) => state.location);
    const [coordinates, setCoordinates] = useState<LngLatLike>();
    const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const classes = useStyles();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append("coordinates", JSON.stringify(coordinates));
        data.append("resources", JSON.stringify(selectedResources));
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        // @ts-ignore
        for (const [key, value] of data) {
            console.log(`${key}: ${value}`);
        }

    };
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputFiles = event.target.files;
        if (inputFiles) {
            const newFile = inputFiles[0];

            const fileWithRealName = new File([newFile], newFile.name, {type: newFile.type});

            const newFiles = [...files.slice(0, 1), fileWithRealName, ...files.slice(1)];

            setFiles(newFiles);
        }
    };

    useEffect(() => setCoordinates(location), [location]);

    return (
        clientId === null || resources === null ? <Loading/> :
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
                            <FormGroup sx={{mt: 1, mb: 1}}>
                                <InputLabel>Години роботи</InputLabel>
                                <div style={{display: "flex", paddingTop: 6}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            sx={{m: 0, p: 0, width: '50%'}}
                                            views={['hours', 'minutes']}
                                            format="HH:mm"
                                            label="Початок"
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
                                            label="Завершення"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </FormGroup>
                            <input type="file" id="photo" onChange={handleFileInputChange} multiple/>

                            {/*<FormGroup sx={{mt: 1, mb: 1}}>*/}
                            {/*    <InputLabel>Фото</InputLabel>*/}
                            {/*    <TextField*/}
                            {/*        sx={{p: 0, m: 0}}*/}
                            {/*        margin="normal"*/}
                            {/*        fullWidth*/}
                            {/*        type="file"*/}
                            {/*        name="photo"*/}
                            {/*        id="photo"*/}
                            {/*        inputProps={{*/}
                            {/*            accept: 'image/jpeg, image/png, image/gif',*/}
                            {/*            multiple: true*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</FormGroup>*/}
                            <CheckboxResources resources={resources}
                                               selectedResources={selectedResources}
                                               setSelectedResources={setSelectedResources}/>
                            <MapboxSmall coordinates={coordinates}
                                         setCoordinates={setCoordinates}/>
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
                    </div>

                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Container>
            </>
    );
}