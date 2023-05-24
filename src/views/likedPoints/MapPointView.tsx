import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapPoint from "../../model/MapPoint";
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";
import ResourceView from "../../components/resource/ResourceView";
import MapboxLikedPoints from "../../components/Map/MapboxLikedPoint";

export default function MapPointView({point, children}:{point: MapPoint, children?: React.ReactNode}) {
    return (
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
            <Container style={{margin: '10px 0', width:"100%"}}>
                <MapboxLikedPoints coordinates={point.coordinates}/>
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
                {point.photos.length === 0 ?
                    <Typography style={{color: "gray"}}>
                        <span>Відсутні фото</span>
                    </Typography> : null}
                {children}
            </Container>
        </Container>
    );
}