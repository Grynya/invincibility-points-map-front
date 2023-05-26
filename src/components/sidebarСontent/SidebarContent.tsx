import * as React from 'react';
import Box from "@mui/material/Box";
import MapPoint from "../../model/MapPoint";
import {Typography} from "@material-ui/core";
import Resource from "../../model/Resource";
import Container from '@mui/material/Container';
import {useEffect, useState} from "react";
import {store} from "../../store/store";
import getAddress from "../map/getAdressString";
import {LngLat} from "mapbox-gl";
import MapPointDesc from "./MapPointDesc";

export default function SidebarContent({openedPoint}: { openedPoint: MapPoint | null }) {
    const [addressString, setAddressString] = useState<string | null>(null);
    useEffect(() => {
        const mapboxAccessToken = store.getState().mapboxAccessToken;
        if (mapboxAccessToken && openedPoint) {
            getAddress(mapboxAccessToken, new LngLat(openedPoint.coordinates.lng, openedPoint.coordinates.lat))
                .then((result) => setAddressString(result))
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
                    </Container>
                    <MapPointDesc mapPoint={openedPoint} addressString={addressString}/>
                </Container> : null}
        </React.Fragment>)
}