import * as React from 'react';
import {useEffect, useState} from 'react';
import {Divider} from "@mui/material";
import Box from "@mui/material/Box";
import MapPoint from "../../model/MapPoint";
import {Typography} from "@material-ui/core";
import Resource from "../../model/Resource";
import Container from '@mui/material/Container';
import ResourceView from "../../components/resource/ResourceView";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {useNavigate} from "react-router-dom";
import User from "../../model/User";
import pointService from "../../service/MapPointService";
import {ERating} from "../../model/ERating";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import GroupIcon from '@mui/icons-material/Group';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

export default function SidebarAuthorizedContent({openedPoint, user}:
                                                     { openedPoint: MapPoint | null, user: User }) {
    const navigate = useNavigate();
    const [rating, setRating] = useState<ERating>();
    const [likedColor, setLikedColor] = useState("gray");
    const [dislikedColor, setDislikedColor] = useState("gray");

    const handleDislikePoint = () => {
        if (openedPoint) {
            //delete dislike
            if (rating === ERating.DISLIKED) {
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.NOT_RATED,
                    () => {
                        setRating(ERating.NOT_RATED);
                        setDislikedColor("gray");
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
                        setRating(ERating.DISLIKED);
                        setLikedColor("gray");
                        setDislikedColor("black");
                    },
                    () => {
                        console.log("Unable to dislike point");
                    }
                );
            }
        }
    }
    const isAdmin = (user: User): boolean => {
        return user.roles.includes("ROLE_ADMIN");
    }
    const handleLikePoint = () => {
        if (openedPoint) {
            //delete like
            if (rating === ERating.LIKED) {
                pointService.rate(
                    openedPoint.id,
                    user.id,
                    ERating.NOT_RATED,
                    () => {
                        setRating(ERating.NOT_RATED);
                        setLikedColor("gray");
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
                        setRating(ERating.LIKED);
                        console.log("do like")
                        setDislikedColor("gray");
                        setLikedColor("red");
                    },
                    () => {
                        console.log("Unable to like point");
                    }
                );
            }
        }
    };
    useEffect(() => {
        setRating(ERating.NOT_RATED);
        setLikedColor("gray");
        setDislikedColor("gray");

        if (openedPoint) {
            pointService.getRating(openedPoint.id, user.id, (rating: ERating) => {
                setRating(rating);
                if (rating === ERating.LIKED) {
                    setDislikedColor("gray");
                    setLikedColor("red");
                } else if (rating === ERating.DISLIKED) {
                    setLikedColor("gray");
                    setDislikedColor("black");
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
                margin: '0 25%'
            }}>
                <Button variant="outlined" size="large" style={{color: 'blue', border: '1px solid blue', width: '100%'}}
                        onClick={() => navigate('/addpoint')}>
                    Додати пункт на мапу
                    <AddLocationAltIcon color="inherit"/>
                </Button>
                <Button variant="outlined" size="large" style={{color: 'red', border: '1px solid red', width: '100%'}}
                        onClick={() => navigate('/likedPoints')}>
                    Вподобані пункти
                    <FavoriteIcon color="inherit"/>
                </Button>
                {isAdmin(user) ? <Button variant="outlined" size="large"
                                         style={{color: 'black', border: '1px solid black', width: '100%'}}
                                         onClick={() => navigate('/users')}>
                    Усі користувачі
                    <GroupIcon color="inherit"/>
                </Button> : null}
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
                            <Typography variant="h3">{openedPoint.id}. {openedPoint.name}</Typography>
                            <Box sx={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <IconButton
                                    onClick={handleLikePoint}
                                    size="small"
                                    sx={{
                                        '&:hover': {
                                            color: 'red',
                                            backgroundColor: 'transparent'
                                        },
                                        color: likedColor
                                    }}
                                ><ThumbUpIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={handleDislikePoint}
                                    size="small"
                                    sx={{
                                        '&:hover': {
                                            color: 'black',
                                            backgroundColor: 'transparent'
                                        },
                                        color: dislikedColor
                                    }}
                                ><ThumbDownIcon/>
                                </IconButton>
                            </Box>

                        </Box>
                        <Typography variant="h6">{openedPoint.description}</Typography>
                        <Typography variant="h6">{`Години роботи: ${openedPoint.hoursOfWork}`}</Typography>
                        <Typography variant="h6">{`Телефон: ${openedPoint.phone}`}</Typography>
                    </Container>
                    <Divider/>
                    <Container style={{margin: '10px 0'}}>
                        <Typography variant="h6"><b>Наявні ресурси</b></Typography>
                        {openedPoint.resources.map((resource) => <ResourceView resource={resource}/>)}
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
                        {openedPoint.resources.length === 0 ?
                            <Typography style={{color: "gray"}}>
                                <span>Відсутні фото</span>
                            </Typography> : null}
                    </Container>
                </Container> : null}
        </React.Fragment>
    )
}