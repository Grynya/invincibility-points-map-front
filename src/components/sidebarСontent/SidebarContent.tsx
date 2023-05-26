import * as React from 'react';
import {Divider} from "@mui/material";
import Box from "@mui/material/Box";
import MapPoint from "../../model/MapPoint";
import {Typography} from "@material-ui/core";
import Resource from "../../model/Resource";
import Container from '@mui/material/Container';
import ResourceView from "../resource/ResourceView";
import {useEffect, useState} from "react";
import {store} from "../../store/store";
import getAddress from "../map/getAdressString";
import {LngLat} from "mapbox-gl";

export default function SidebarContent({openedPoint}:{openedPoint: MapPoint | null}) {
    const [addressString, setAddressString] = useState<string|null>(null);
    useEffect( ()=>{
        const mapboxAccessToken = store.getState().mapboxAccessToken
        console.log(openedPoint?.coordinates)
        if (mapboxAccessToken && openedPoint) {
            getAddress(mapboxAccessToken, new LngLat(openedPoint.coordinates.lng, openedPoint.coordinates.lat)).then((result)=>{
                console.log(result)
                setAddressString(result);
            })
        }
    }, [openedPoint]);
    return (
        <React.Fragment>
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
                            {openedPoint.resources.map((resource, idx) =>
                                <ResourceView key={idx} resource={resource}/>)}
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