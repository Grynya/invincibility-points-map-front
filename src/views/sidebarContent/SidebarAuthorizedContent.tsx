import * as React from 'react';
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
import {useEffect, useState} from "react";
import pointService from "../../service/PointService";


export default function SidebarAuthorizedContent({openedPoint, user}:
{ openedPoint: MapPoint | null, user: User}) {
    const navigate = useNavigate();
    // const [likedStyle, setLikedStyle] = useState<{ isLiked: boolean, text: string; color: string }>({
    //     isLiked: false,
    //     text: "Вподобати",
    //     color: "gray"
    // });
    const [isLiked, setIsLiked] = useState(false);
    const [likedText, setLikedText] = useState("Вподобати");
    const [likedColor, setLikedColor] = useState("gray");

    const handleLikePoint = () => {
        console.log(isLiked);
        if (openedPoint) {
            if (isLiked) {
                pointService.unlike(
                    openedPoint.id,
                    user.id,
                    () => {
                        setIsLiked(false);
                        setLikedText("Вподобати");
                        setLikedColor("gray");
                    },
                    () => {
                        console.log("Unable to unlike point");
                    }
                );
            } else {
                pointService.like(
                    openedPoint.id,
                    user.id,
                    () => {
                        setIsLiked(true);
                        setLikedText("Вподобано");
                        setLikedColor("red");
                    },
                    () => {
                        console.log("Unable to like point");
                    }
                );
            }
        }
    };

    // const handleLikePoint = () => {
    //     if (openedPoint) {
    //         if (likedStyle.isLiked)
    //             pointService.unlike(openedPoint.id, user.id,
    //                 () => {
    //                     console.log("success")
    //                     setLikedStyle({isLiked: true, text: "Вподобано", color: "red"})
    //                     console.log(likedStyle);
    //                 }, () => {
    //                     console.log("Unable to unlike point")
    //                 });
    //         else pointService.like(openedPoint.id, user.id,
    //             () => {
    //                 console.log("success")
    //                 setLikedStyle({isLiked: false, text: "Вподобати", color: "gray"})
    //                 console.log(likedStyle);
    //
    //             },
    //             () => {
    //                 console.log("Unable to load like point")
    //             });
    //     }
    // };
    useEffect(() => {
        if (openedPoint) {
            pointService.isLiked(openedPoint.id, user.id, (isLiked) => {
                if (isLiked) {
                    setIsLiked(true);
                    setLikedText("Вподобано");
                    setLikedColor("red");
                }
                else {
                    setIsLiked(false);
                    setLikedText("Вподобати");
                    setLikedColor("gray");
                }
            }, () => {
                console.log("Unable to load like of point")
            })
        }
    }, [openedPoint])

    return (
        <React.Fragment>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2}}>
                <Button variant="contained" color="primary" onClick={() => navigate('/addpoint')}>
                    Додати пункт на мапу
                </Button>
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
                            >{likedText}
                                <FavoriteIcon color={'inherit'}/>
                            </IconButton>
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