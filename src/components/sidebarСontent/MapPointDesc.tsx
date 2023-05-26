import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ResourceView from "../resource/ResourceView";
import Resource from "../../model/Resource";
import MapPoint from "../../model/MapPoint";
import PointPhoto from "../../model/PointPhoto";
import {Divider} from "@mui/material";

export default function MapPointDesc({mapPoint, addressString}: { mapPoint: MapPoint, addressString:string | null}) {
    return (
        <React.Fragment>
            <Divider/>
            <Container style={{margin: '10px 0'}}>
                <Typography variant="h6"><i>{mapPoint.description}</i></Typography>
                <Typography variant="h6"><b>Години роботи:</b> {mapPoint.hoursOfWork}</Typography>
                <Typography variant="h6"><b>Телефон:</b> {mapPoint.phone}</Typography>
                {addressString?<Typography variant="h6"><b>Адреса:</b> {addressString}</Typography>:null}
            </Container>
            <Divider/>
            <ResourceListView resources={mapPoint.resources}/>
            <Divider/>
            <PhotoListView photos={mapPoint.photos}/>
        </React.Fragment>
    )
}


function ResourceListView({resources}: { resources: Resource[] }) {
    return (
        <Container style={{margin: '10px 0'}}>
            <Typography variant="h6"><b>Наявні ресурси</b></Typography>
            {
                resources.map((resource, key) =>
                    <ResourceView resource={resource} key={key}/>
                )
            }
            {
                resources.length === 0 ?
                    <Typography style={{"color": "gray"}}>
                        <span>Відсутні ресурси</span>
                    </Typography> : null
            }
        </Container>
    );
}
function PhotoListView({photos}: { photos: PointPhoto[] }) {
    return (
        <Container style={{margin: '10px 0'}}>
            <Typography variant="h6"><b>Фото</b></Typography>
            {photos.map((photo) => (
                <img
                    key={photo.id}
                    src={"data:image/png;base64," + photo.fileContent}
                    alt={photo.fileName}
                    style={{width: '300px', height: 'auto'}}
                />
            ))}
            {photos.length === 0 ?
                <Typography style={{color: "gray"}}>
                    <span>Відсутні фото</span>
                </Typography> : null}
        </Container>
    );
}