import Mapbox from "../components/Map/Mapbox";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {styled, Theme, useTheme} from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Header from "../components/Header/Header";
import {Divider} from "@mui/material";
import MapPoint from "../model/MapPoint";
import User from "../model/User";
import SidebarContent from "./sidebarContent/SidebarContent";
import SidebarAuthorizedContent from "./sidebarContent/SidebarAuthorizedContent";

const drawerWidth = 540;

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
    const [open, setOpen] = useState<boolean>(false);
    const [openedPoint, setOpenedPoint] = useState<MapPoint | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpenedPoint(null)
        setOpen(false);
    };
    useEffect(() => {
        let userStr = localStorage.getItem("user");
        if (userStr) setUser(JSON.parse(userStr));
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
                {user? <SidebarAuthorizedContent openedPoint={openedPoint} user={user}/>:
                    <SidebarContent openedPoint={openedPoint}/>}
            </Drawer>
            <Main open={open} theme={theme}>
                <Mapbox setOpen={setOpen} setOpenedPoint={setOpenedPoint}/>
            </Main>
        </React.Fragment>
    );
}