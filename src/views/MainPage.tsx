import Mapbox from "../components/Map/Mapbox";
import * as React from 'react';
import {useEffect} from 'react';
import {styled, Theme, useTheme} from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Header from "../components/Header/Header";
import {Divider} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from 'react-router-dom';
import MapPoint from "../model/MapPoint";
import {Typography} from "@material-ui/core";
import Resource from "../model/Resource";
import Container from '@mui/material/Container';
import ResourceView from "../components/resource/ResourceView";

const drawerWidth = 340;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{ theme: Theme, open: boolean }>(
    ({theme, open}) => ({
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export default function MainPage() {
    const theme = useTheme();
    const [open, setOpen] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const [openedPoint, setOpenedPoint] = React.useState<MapPoint | null>(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpenedPoint(null)
        setOpen(false);
    };
    useEffect(() => {
        console.log(Array.isArray(openedPoint?.resources))
    }, [openedPoint])

    return (
        <React.Fragment>
            <CssBaseline/>
            <Header open={open}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{mr: 2, ...(open && {display: 'none'})}}
                >
                    <MenuIcon/>
                </IconButton>
            </Header>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                {localStorage.getItem("user") ?
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2}}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/addpoint')}>
                            Додати пункт на мапу
                        </Button>
                    </Box> : null}
                {openedPoint && Array.isArray(openedPoint.resources as Resource[]) ?
                    <Container component="main" maxWidth="xs" key={openedPoint.id}>
                        <Typography variant="h4">{openedPoint.name}</Typography>
                        <Typography variant="h5">{openedPoint.description}</Typography>
                        <Typography variant="subtitle1">{`Години роботи: ${openedPoint.hoursOfWork}`}</Typography>
                        <Typography variant="subtitle1">{`Телефон: ${openedPoint.phone}`}</Typography>
                        <Divider/>
                        <Container style={{margin: '10px 0'}}>
                            <Typography variant="h5">Наявні ресурси</Typography>
                            {openedPoint.resources.map((resource) => <ResourceView resource={resource}/>)}
                        </Container>
                        {openedPoint.photos.map((photo) => (
                            <img
                                key={photo.id}
                                src={"data:image/png;base64," + photo.fileContent}
                                alt={photo.fileName}
                                style={{width: '300px', height: 'auto'}}
                            />
                        ))}
                    </Container> : null}
            </Drawer>
            <Main open={open} theme={theme}>
                <Mapbox setOpen={setOpen} setOpenedPoint={setOpenedPoint}/>
            </Main>
        </React.Fragment>
    );
}