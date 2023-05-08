import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../components/Header/Header";
import Copyright from "../components/Copyright";
import {useSelector} from "react-redux";
import {StoreState} from "../store/StoreState";
import Loading from "../components/Loading";
import 'mapbox-gl/dist/mapbox-gl.css';
import User from "../model/User";
import FavoriteIcon from "@mui/icons-material/Favorite";
import userService from "../service/UserService";
import MapPoint from "../model/MapPoint";
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";
import ResourceView from "../components/resource/ResourceView";
import MapboxLikedPoints from "../components/Map/MapboxLikedPoint";

export default function LikedPointsPage() {
    const resources = useSelector((state: StoreState) => state.resources);
    const [user, setUser] = useState<User>()
    const [likedPoints, setLikedPoints] = useState<MapPoint[]>()

    useEffect(() => {
        const userItem = localStorage.getItem("user")
        if (userItem) {
            setUser(JSON.parse(userItem));
            if (user) {
                userService.getLikedPoints(user.id,
                    (likedPoints) => {
                        setLikedPoints(likedPoints);
                    },
                    () => {
                        console.log("Unable to fetch data")
                    });
            }
        }

    })
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
                        <Avatar sx={{m: 1, backgroundColor: 'red'}}>
                            <FavoriteIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Вподобані пункти
                        </Typography>
                        {likedPoints ? likedPoints.map((point)=>
                            <Container component="main" maxWidth="xl" key={point.id}>
                                <Container style={{margin: '10px 0'}}>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                                        <Typography variant="h3">{point.name}</Typography>
                                    </Box>
                                    <Typography variant="h6">{point.description}</Typography>
                                    <Typography variant="h6">{`Години роботи: ${point.hoursOfWork}`}</Typography>
                                    <Typography variant="h6">{`Телефон: ${point.phone}`}</Typography>
                                </Container>
                                <Divider/>
                                <Container style={{margin: '10px 0'}}>
                                    <MapboxLikedPoints coordinates={point.coordinates}/>
                                    {/*<MapboxSmall coordinates={point.coordinates}*/}
                                    {/*             setCoordinates={setCoordinates}/>*/}
                                    <Typography variant="h6"><b>Наявні ресурси</b></Typography>
                                    {point.resources.map((resource) => <ResourceView resource={resource}/>)}
                                    {point.resources.length === 0 ?
                                        <Typography style={{"color": "gray"}}>
                                            <span>Відсутні ресурси</span>
                                        </Typography> : null}
                                </Container>
                                <Divider/>
                                <Container style={{margin: '10px 0'}}>
                                    <Typography variant="h6"><b>Фото</b></Typography>
                                    {point.photos.map((photo) => (
                                        <img
                                            key={photo.id}
                                            src={"data:image/png;base64," + photo.fileContent}
                                            alt={photo.fileName}
                                            style={{width: '300px', height: 'auto'}}
                                        />
                                    ))}
                                    {point.resources.length === 0 ?
                                        <Typography style={{color: "gray"}}>
                                            <span>Відсутні фото</span>
                                        </Typography> : null}
                                </Container>
                            </Container>
                        ):"Не вдалося завантажити вподобані пункти"}
                    </div>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Container>
            </>
    );
}