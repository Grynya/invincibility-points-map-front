import React, {ReactElement} from "react";
import {Toolbar, Typography, Box,} from "@material-ui/core";
import Link from "@mui/material/Link";
// @ts-ignore
import {ReactComponent as Logo} from "../../img/logo.svg";
import AuthMenu from "./AuthMenu";
import {styled, Theme, useTheme} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";

const drawerWidth = 340;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{theme: Theme, open: boolean}>(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function Header({children, open}: {children?:ReactElement, open:boolean}) {
    const theme = useTheme();
    return (
        <AppBar position="relative"
                open={open}
                className="yellow-bottom-border black-color" theme={theme}>
            <Toolbar>
                {children}
                <Link style={{textDecoration: 'none', color: 'inherit'}} href="/">
                    <Box display="flex" alignItems="center">
                        <Logo/>
                        <Typography variant="h5" style={{
                            fontWeight: "bold",
                            fontFamily: "'Khula', sans-serif"
                        }} className="blue-color">Пункти незламності</Typography>
                    </Box>
                </Link>
                <div style={{flexGrow: 1}}></div>
                <AuthMenu/>
            </Toolbar>
        </AppBar>
    );
}