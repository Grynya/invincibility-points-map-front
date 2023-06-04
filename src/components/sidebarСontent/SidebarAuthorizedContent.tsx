import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Divider, IconButton} from "@mui/material";
import Box from "@mui/material/Box";
import MapPoint from "../../model/MapPoint";
import {Typography} from "@material-ui/core";
import Resource from "../../model/Resource";
import Container from '@mui/material/Container';
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
import getAddress from "../map/getAdressString";
import {store} from "../../store/store";
import {LngLat} from "mapbox-gl";
import MenuListItem from "./MenuListItem";
import MapPointDesc from "./MapPointDesc";
import {changeError} from "../../store/actionCreators/changeError";

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
    const [addressString, setAddressString] = useState<string | null>(null);
    const changeRatingInfo = (rating: ERating.LIKED | ERating.DISLIKED, action: 'add' | 'remove') => {
        if (rating === ERating.LIKED) {
            const numOfLikes = action === 'add' ? ratingInfo.numOfLikes + 1 : ratingInfo.numOfLikes - 1;
            const numOfDislikes = action === 'add' && ratingInfo.eRating === ERating.DISLIKED ?
                ratingInfo.numOfDislikes - 1 : ratingInfo.numOfDislikes;
            setRatingInfo(prevState => ({
                ...prevState,
                eRating: ERating.LIKED,
                numOfLikes,
                numOfDislikes
            }));
        } else {
            const numOfDislikes =
                action === 'add' ? ratingInfo.numOfDislikes + 1 : ratingInfo.numOfDislikes - 1;
            const numOfLikes =
                action === 'add' && ratingInfo.eRating === ERating.LIKED ?
                    ratingInfo.numOfLikes - 1 : ratingInfo.numOfLikes;
            setRatingInfo(prevState => ({
                ...prevState,
                eRating: ERating.DISLIKED,
                numOfLikes,
                numOfDislikes
            }));
        }
    };

    const handleDislikePoint = () => {
        if (openedPoint) {
            //delete dislike
            if (ratingInfo.numOfDislikes > 0 && ratingInfo.eRating === ERating.DISLIKED) {
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.NOT_RATED,
                    () => {
                        changeRatingInfo(ERating.DISLIKED, 'remove');
                        dislikedColor.current = "gray";
                    },
                    () => {
                        store.dispatch(changeError("Виникла помилка"));
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
                        store.dispatch(changeError("Виникла помилка"));
                        console.log("Unable to dislike point");
                    }
                );
            }
        }
    }

    const handleLikePoint = () => {
        if (openedPoint) {
            //delete like
            if (ratingInfo.numOfLikes > 0 && ratingInfo.eRating === ERating.LIKED) {
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.NOT_RATED,
                    () => {
                        changeRatingInfo(ERating.LIKED, 'remove');
                        likedColor.current = "gray";
                    },
                    () => {
                        store.dispatch(changeError("Виникла помилка"));
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
                        store.dispatch(changeError("Виникла помилка"));
                        console.log("Unable to like point");
                    }
                );
            }
        }
    };
    useEffect(() => {
        const mapboxAccessToken = store.getState().mapboxAccessToken
        if (mapboxAccessToken && openedPoint) {
            getAddress(mapboxAccessToken, new LngLat(openedPoint.coordinates.lng, openedPoint.coordinates.lat))
                .then(result => setAddressString(result));
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
            }, (error: Error) => console.log(error));
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
                        <MenuListItem onClick={() => navigate('/addpoint')}
                                      text={"Додати пункт на мапу"}
                                      icon={<AddLocationAltIcon fontSize="large"/>}
                        />
                        <MenuListItem onClick={() => navigate('/likedPoints')}
                                      text={"Вподобані пункти"}
                                      icon={<FavoriteIcon fontSize="large"/>}
                        />
                        {authService.isAdmin(user) ?
                            <>
                                <Divider/>
                                <MenuListItem onClick={() => navigate('/users')}
                                              text={"Усі користувачі"}
                                              icon={<GroupIcon fontSize="large"/>}/>
                            </> : null}
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
                    </Container>
                    <MapPointDesc mapPoint={openedPoint} addressString={addressString}/>
                </Container> : null}
        </React.Fragment>
    )
}