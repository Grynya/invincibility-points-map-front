import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../../components/header/Header";
import Copyright from "../../components/Copyright";
import Loading from "../../components/Loading";
import 'mapbox-gl/dist/mapbox-gl.css';
import FavoriteIcon from "@mui/icons-material/Favorite";
import userService from "../../service/UserService";
import MapPoint from "../../model/MapPoint";
import {store} from "../../store/store";
import MapPointView from "./MapPointView";
import Box from "@mui/material/Box";
import ToMainButton from "../../components/ToMainButton";

export default function LikedPointsPage() {
    const [likedPoints, setLikedPoints] = useState<MapPoint[]>();

    useEffect(() => {
        const user = store.getState().user;
        console.log(store.getState())
        if (user) {
            userService.getLikedPoints(
                user.id,
                (likedPoints) => {
                    setLikedPoints(likedPoints);
                },
                () => {
                    console.log("Unable to fetch data");
                }
            );
        }
    }, []); // Dependency array with user to trigger when user changes

    return (
        likedPoints === null ? <Loading/> :
            <>
                <CssBaseline/>
                <Header open={false}/>
                <Container component="main" className="custom-cursor" maxWidth="xl">
                    <CssBaseline/>
                    <Box
                        style={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <ToMainButton/>
                        <Avatar sx={{m: 1, backgroundColor: 'red'}}>
                            <FavoriteIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Вподобані пункти
                        </Typography>
                        {likedPoints ? likedPoints.map((point, idx)=>
                            <MapPointView key={idx} point={point}/>
                        ):"Не вдалося завантажити вподобані пункти"}
                    </Box>
                    <Copyright sx={{mt: 8, mb: 4}}/>
                </Container>
            </>
    );
}