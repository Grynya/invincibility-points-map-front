import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from "../components/Header/Header";
import Loading from "../components/Loading";
import 'mapbox-gl/dist/mapbox-gl.css';
import userService from "../service/UserService";
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";
import {store} from "../store/store";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import User from "../model/User";
import GroupIcon from "@mui/icons-material/Group";
import Link from '@mui/material/Link';
import MapPoint from "../model/MapPoint";
import mapPointService from "../service/MapPointService";
import MapPointView from "./likedPoints/MapPointView";
import Dialog from '@mui/material/Dialog';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>();
    const [currentName, setCurrentName] = useState<string>("");
    const [currentPoints, setCurrentPoints] = useState<MapPoint[]>();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        const user = store.getState().user;
        if (user) {
            userService.getAllUsers(
                (users) => setUsers(users),
                () => console.log("Unable to fetch data")
            );
        }
    }, []);

    const handleShowPoints = async (user: User) => {
        setCurrentName(user.surname + " " + user.name);
        setCurrentPoints(await mapPointService.getPointsByUser(user.id));
        setOpen(true);
    };

    const handleClosePoints = () => {
        setCurrentName("");
        setOpen(false);
    };

    const handleDeleteMapPoint = async (pointId: number) => {
        await mapPointService.deleteMapPoint(pointId,
            () => {
                setCurrentPoints(currentPoints?.filter(point => point.id !== pointId));
            }, () => console.log("Unable to delete"));
    }
    return (
        users === null ? <Loading/> :
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
                        <Avatar sx={{m: 1, backgroundColor: 'black'}}>
                            <GroupIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Користувачі
                        </Typography>
                        {users ? users.map((user, idx) =>
                            <Container component="main" maxWidth="xl" key={user.id}>
                                <Container style={{margin: '10px 0'}}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Typography variant="h5">{idx + 1}. {user.surname} {user.name}</Typography>
                                    </Box>
                                    <Typography variant="h6">Електронна пошта: {user.email}</Typography>
                                    <Typography
                                        variant="h6">Статус: {user.userStatus === 'ACTIVE' ? 'Активний' : 'Не активний'}</Typography>
                                    <Typography variant="h6">
                                        <Link style={{cursor: 'pointer'}} onClick={() => handleShowPoints(user)}>Показати
                                            пункти</Link>
                                    </Typography>
                                </Container>
                                <Divider/>
                            </Container>
                        ) : "Не вдалося завантажити користувачів"}
                        <Dialog onClose={handleClosePoints} open={open}>
                            <Container style={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minHeight: '30vh',
                            }}>
                                <Avatar sx={{m: 1, backgroundColor: 'black'}}>
                                    <GroupIcon/>
                                </Avatar>
                                <Typography component="h1" variant="h5">Пункти {currentName}
                                </Typography>
                                {currentPoints?.length === 0 ?
                                    <Typography variant="subtitle1">Пункти відсутні</Typography>
                                    : null}
                                {currentPoints ? currentPoints.map((point, idx) =>
                                    <MapPointView point={point} key={idx} children={
                                        <Button variant="contained" color="error" style={{margin: 10}}
                                                onClick={() => handleDeleteMapPoint(point.id)}>
                                            Видалити пункт
                                        </Button>
                                    }/>) : "Не вдалося завантажити пункти"}
                            </Container>
                        </Dialog>
                        <Button variant="contained" color="primary" style={{margin: 10}} onClick={() => navigate('/')}>
                            На головну
                        </Button>
                    </div>

                </Container>
            </>
    )
        ;
}
