import {ClassNameMap, Menu, MenuItem} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, {useEffect, useState} from "react";
import {IconButton, Toolbar} from "@material-ui/core";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import useStyles from "./styles";
import User from "../../model/User";
import Logout from "./Logout";

export default function AuthMenu() {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [user, setUser] = useState<User>()
    const classes: ClassNameMap = useStyles();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
        const userItem = localStorage.getItem("user")
        if (userItem) {
            setUser(JSON.parse(userItem))
        }
    }, [])
    return <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                    onClick={handleClick}>
            <AccountBoxIcon style={{fontSize: '30px'}}/></IconButton>
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {!user ?
                <a href="/login" className="no-text-decoration">
                    <MenuItem>
                        <LoginIcon style={{margin: 5}}/>
                        Увійти
                    </MenuItem></a> : null}
            {!user ?
                <a href="/registration" className="no-text-decoration">
                    <MenuItem>
                        <PersonAddIcon style={{margin: 5}}/>
                        Зареєструватись
                    </MenuItem>
                </a> : null}
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