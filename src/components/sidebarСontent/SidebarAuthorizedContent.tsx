import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Divider, IconButton} from "@mui/material";
import Box from "@mui/material/Box";
import MapPoint from "../../model/MapPoint";
import {Typography} from "@material-ui/core";
import Resource from "../../model/Resource";
import Container from '@mui/material/Container';
import ResourceView from "../resource/ResourceView";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {useNavigate} from "react-router-dom";
import User from "../../model/User";
import pointService from "../../service/MapPointService";
import {ERating} from "../../model/ERating";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import GroupIcon from '@mui/icons-material/Group';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import authService from "../../service/AuthService";
import {RatingResponse} from "../../payloads/response/RatingResponse";
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import getAddress from "../map/getAdressString";
import {store} from "../../store/store";
import {LngLat} from "mapbox-gl";

export default function SidebarAuthorizedContent({openedPoint, user}:
                                                     { openedPoint: MapPoint | null, user: User }) {
    const navigate = useNavigate();
    const [ratingInfo, setRatingInfo] = useState<RatingResponse>({
        eRating: ERating.NOT_RATED,
        numOfLikes: 0,
        numOfDislikes: 0
    });
    const likedColor = useRef("gray");
    const dislikedColor = useRef("gray");
    const [addressString, setAddressString] = useState<string|null>(null);
    const changeRatingInfo = (rating: ERating.LIKED | ERating.DISLIKED, action: 'add' | 'remove') => {
        if (rating === ERating.LIKED) {
            if (action === 'add') {
                if (ratingInfo.eRating === ERating.DISLIKED) {
                    setRatingInfo(prevState => ({
                        ...prevState,
                        numOfDislikes: prevState.numOfDislikes - 1
                    }));
                }
                setRatingInfo(prevState => ({
                    ...prevState,
                    eRating: ERating.LIKED,
                    numOfLikes: prevState.numOfLikes + 1
                }));
            } else {
                setRatingInfo(prevState => ({
                    ...prevState,
                    eRating: ERating.LIKED,
                    numOfLikes: prevState.numOfLikes - 1
                }));
            }
        } else {
            if (action === 'add') {
                if (ratingInfo.eRating === ERating.LIKED) {
                    setRatingInfo(prevState => ({
                        ...prevState,
                        numOfLikes: prevState.numOfLikes - 1
                    }));
                }
                setRatingInfo(prevState => ({
                    ...prevState,
                    eRating: ERating.DISLIKED,
                    numOfDislikes: prevState.numOfDislikes + 1
                }));
            } else if (action === 'remove') {
                setRatingInfo(prevState => ({
                    ...prevState,
                    eRating: ERating.DISLIKED,
                    numOfDislikes: prevState.numOfDislikes - 1
                }));
            }
        }
    };

    const handleDislikePoint = () => {
        if (openedPoint) {
            //delete dislike
            if (ratingInfo.numOfDislikes>0 && ratingInfo.eRating === ERating.DISLIKED) {
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.NOT_RATED,
                    () => {
                        changeRatingInfo(ERating.DISLIKED, 'remove');
                        dislikedColor.current = "gray";
                    },
                    () => {
                        console.log("Unable to delete dislike of point");
                    }
                );
            } else {
                //do dislike
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.DISLIKED,
                    () => {
                        changeRatingInfo(ERating.DISLIKED, 'add');
                        likedColor.current = "gray";
                        dislikedColor.current = "black";
                    },
                    () => {
                        console.log("Unable to dislike point");
                    }
                );
            }
        }
    }

    const handleLikePoint = () => {
        if (openedPoint) {
            //delete like
            if (ratingInfo.numOfLikes>0 && ratingInfo.eRating === ERating.LIKED) {
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.NOT_RATED,
                    () => {
                        changeRatingInfo(ERating.LIKED, 'remove');
                        likedColor.current = "gray";
                    },
                    () => {
                        console.log("Unable to delete like of point");
                    }
                );
            } else {
                //do like
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.LIKED,
                    () => {
                        changeRatingInfo(ERating.LIKED, 'add');
                        dislikedColor.current = "gray";
                        likedColor.current = "red";
                    },
                    () => {
                        console.log("Unable to like point");
                    }
                );
            }
        }
    };
    useEffect( ()=>{
        const mapboxAccessToken = store.getState().mapboxAccessToken
        console.log(openedPoint?.coordinates)
        if (mapboxAccessToken && openedPoint) {
            getAddress(mapboxAccessToken, new LngLat(openedPoint.coordinates.lng, openedPoint.coordinates.lat))
                .then(result=>setAddressString(result));
        }
    }, [openedPoint]);
    useEffect(() => {
        setRatingInfo({
            eRating: ERating.NOT_RATED,
            numOfLikes: 0,
            numOfDislikes: 0
        });
        dislikedColor.current = "gray";
        likedColor.current = "gray";
        if (openedPoint) {
            pointService.getRating(openedPoint.id, user.id, (ratingResponse: RatingResponse) => {
                setRatingInfo(ratingResponse);
                if (ratingResponse.eRating === ERating.LIKED) {
                    likedColor.current = "red";
                } else if (ratingResponse.eRating === ERating.DISLIKED) {
                    dislikedColor.current = "black"
                }
            }, () => {
                console.log("Unable to load like of point")
            })
        }
    }, [openedPoint])

    return (
        <React.Fragment>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                margin: '0'
            }}>
                <Paper sx={{width: 540, maxWidth: '100%', p: '0 30px'}}>
                    <MenuList>
                        <MenuItem onClick={() => navigate('/addpoint')} style={{height: '80px'}}>
                            <ListItemIcon>
                                <AddLocationAltIcon fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography style={{fontSize: 'x-large'}}>Додати пункт на мапу</Typography>
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/likedPoints')} style={{height: '80px'}}>
                            <ListItemIcon>
                                <FavoriteIcon fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography style={{fontSize: 'x-large'}}>Вподобані пункти</Typography>
                            </ListItemText>
                        </MenuItem>
                        {authService.isAdmin(user) ?
                            <><Divider/>
                                <MenuItem onClick={() => navigate('/users')} style={{height: '80px'}}>
                                <ListItemIcon>
                                    <GroupIcon fontSize="large"/>
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography style={{fontSize: 'x-large'}}>Усі користувачі</Typography>
                                </ListItemText>
                            </MenuItem></> : null}
                    </MenuList>
                </Paper>

            </Box>
            {!openedPoint ?
                <Container>
                    <Typography variant="h4" style={{color: "gray", margin: '50px 0', textAlign: "center"}}>
                        <span>Оберіть пункт</span>
                    </Typography>
                </Container> : null}
            {openedPoint && Array.isArray(openedPoint.resources as Resource[]) ?
                <Container component="main" maxWidth="xl" key={openedPoint.id}>
                    <Container style={{margin: '10px 0'}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h3">{openedPoint.name}</Typography>
                            <Box sx={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <IconButton
                                    onClick={handleLikePoint}
                                    size="small"
                                    style={{color: likedColor.current}}
                                >{ratingInfo.numOfLikes} <ThumbUpIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={handleDislikePoint}
                                    size="small"
                                    style={{color: dislikedColor.current}}
                                >{ratingInfo.numOfDislikes} <ThumbDownIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                        <Typography variant="h6">{openedPoint.description}</Typography>
                    </Container>
                    <Divider/>
                    <Container style={{margin: '10px 0'}}>
                        <Typography variant="h6"><b>Години роботи:</b> {openedPoint.hoursOfWork}</Typography>
                        <Typography variant="h6"><b>Телефон:</b> {openedPoint.phone}</Typography>
                        <Typography variant="h6"><b>Адреса:</b> {addressString}</Typography>
                    </Container>
                    <Divider/>
                    <Container style={{margin: '10px 0'}}>
                        <Typography variant="h6"><b>Наявні ресурси</b></Typography>
                        {openedPoint.resources.map((resource, key) =>
                            <ResourceView resource={resource} key={key}/>)}
                        {openedPoint.resources.length === 0 ?
                            <Typography style={{"color": "gray"}}>
                                <span>Відсутні ресурси</span>
                            </Typography> : null}
                    </Container>
                    <Divider/>
                    <Container style={{margin: '10px 0'}}>
                        <Typography variant="h6"><b>Фото</b></Typography>
                        {openedPoint.photos.map((photo) => (
                            <img
                                key={photo.id}
                                src={"data:image/png;base64," + photo.fileContent}
                                alt={photo.fileName}
                                style={{width: '300px', height: 'auto'}}
                            />
                        ))}
                        {openedPoint.photos.length === 0 ?
                            <Typography style={{color: "gray"}}>
                                <span>Відсутні фото</span>
                            </Typography> : null}
                    </Container>
                </Container> : null}
        </React.Fragment>
    )
}