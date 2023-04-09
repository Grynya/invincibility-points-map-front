import Mapbox from "../components/Map/Mapbox";
import * as React from 'react';
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
import {useSelector} from "react-redux";
import {StoreState} from "../store/StoreState";

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
    const user = useSelector((state: StoreState) => state.user);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

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
                {user !== null ? <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2}}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/addpoint')}>
                        Додати пункт на мапу
                    </Button>
                </Box> : null}
            </Drawer>
            <Main open={open} theme={theme}>
                <Mapbox/>
            </Main>
        </React.Fragment>
    );
}