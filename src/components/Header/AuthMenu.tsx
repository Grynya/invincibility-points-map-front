import {GoogleLogout} from "react-google-login";
import {ClassNameMap, Menu, MenuItem} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, {useContext, useEffect, useState} from "react";
import {IconButton, Toolbar} from "@material-ui/core";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {useSelector} from "react-redux";
import useStyles from "./styles";
import {ProfileContext} from "../ProfileProvider";
import {StoreState} from "../../store/StoreState";
import User from "../../model/User";
import Logout from "./Logout";

export default function AuthMenu() {
    const { profile, setProfile } = useContext(ProfileContext);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const clientId = useSelector<StoreState, string|null>((state: StoreState) => state.googleClientId);
    const [user, setUser] = useState<User>()
    const classes:ClassNameMap = useStyles();
    const handleClick = (event:React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const logout = () => setProfile(null);

    useEffect(()=>{
        const userItem = localStorage.getItem("user")
        if (userItem){
            setUser(JSON.parse(userItem))
        }
    }, [])
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
        {/*only for Google oAuth menu*/}
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
        {profile === null && !user ?
            <a href="/login" className="no-text-decoration">
                <MenuItem>
                    <LoginIcon style={{margin: 5}}/>
                    Увійти
                </MenuItem></a> : null}
        {profile === null && !user ?
            <a href="/registration" className="no-text-decoration">
                <MenuItem>
                    <PersonAddIcon style={{margin: 5}}/>
                    Зареєструватись
                </MenuItem>
            </a> : null}
        {/*only for JWT authorization menu when user logged in with jwt*/}
        {user ?
            <div className="profile-desc">
                <p className="bold-text">{user.name}</p>
                <p className="bold-text">{user.surname}</p>
                <p className="light-text">{user.email}</p>
                <hr/>
                <Logout/>
            </div> : null}
    </Menu></Toolbar>

}