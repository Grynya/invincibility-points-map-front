import {GoogleLogout} from "react-google-login";
import {ClassNameMap, Menu, MenuItem} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, {useContext, useState} from "react";
import {IconButton, Toolbar} from "@material-ui/core";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {useSelector} from "react-redux";
import useStyles from "./styles";
import {ProfileContext} from "../ProfileProvider";
import {StoreState} from "../../store/StoreState";

export default function AuthMenu() {
    const { profile, setProfile } = useContext(ProfileContext);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const clientId = useSelector<StoreState, string|null>((state: StoreState) => state.googleClientId);
    const classes:ClassNameMap = useStyles();
    const handleClick = (event:React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const logout = () => setProfile(null);

    return <Toolbar>
        {profile !== null ?
            <IconButton edge="start"
                        className={classes.menuButton}
                        color="inherit" aria-label="menu"
                        onClick={handleClick}
            >
                <img src={profile.imageUrl} width={"30px"} height={"30px"} alt={"img"}/>
            </IconButton> :
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                        onClick={handleClick}
            ><AccountBoxIcon style={{fontSize: '30px'}}/></IconButton>}<Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
    >
        {profile!== null && clientId!==null?
            <div className="profile-desc">
                <img src={profile.imageUrl} width={"50px"} height={"50px"} alt={"img"}/>
                <p className="bold-text">{profile.name}</p>
                <p className="light-text">{profile.email}</p>
                <hr/>
                <GoogleLogout
                    clientId={clientId}
                    buttonText={"Logout"}
                    style={{width: '400px'}}
                    onLogoutSuccess={logout}
                />
            </div> : null}
        {profile === null ?
            <a href="/login" className="no-text-decoration">
                <MenuItem>
                    <LoginIcon style={{margin: 5}}/>
                    Увійти
                </MenuItem></a> : null}
        {profile === null ?
            <a href="/registration" className="no-text-decoration">
                <MenuItem>
                    <PersonAddIcon style={{margin: 5}}/>
                    Зареєструватись
                </MenuItem>
            </a> : null}
    </Menu></Toolbar>

}