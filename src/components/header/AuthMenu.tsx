import {ClassNameMap, Menu, MenuItem, Typography} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, {useState} from "react";
import {IconButton, Toolbar} from "@material-ui/core";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import useStyles from "./styles";
import Logout from "./Logout";
import {store} from "../../store/store";
import Avatar from "@mui/material/Avatar";
import PersonPinIcon from '@mui/icons-material/PersonPin';
export default function AuthMenu() {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const user = store.getState().user
    const classes: ClassNameMap = useStyles();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                    onClick={handleClick}>
            <AccountBoxIcon style={{fontSize: '30px'}}/></IconButton>
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{minWidth: '900px'}}
        >
            {!user ?
                <a href="/login" className="no-text-decoration">
                    <MenuItem style={{height: '80px'}}>
                        <LoginIcon fontSize="large"/>
                        <Typography style={{fontSize: 'large'}}>Увійти</Typography>
                    </MenuItem></a> : null}
            {!user ?
                <a href="/registration" className="no-text-decoration">
                    <MenuItem style={{height: '80px'}}>
                        <PersonAddIcon fontSize="large"/>
                        <Typography style={{fontSize: 'large'}}>Зареєструватись</Typography>
                    </MenuItem>
                </a> : null}
            {user ?
                <div className="profile-desc" style={{ display: 'flex', flexDirection:"column", alignItems: 'center' }}>
                    <Avatar className="blue-bg" sx={{m: 1}}>
                        <PersonPinIcon/>
                    </Avatar>
                    <Typography variant="h5" style={{fontWeight: 600}}>{user.name} {user.surname}</Typography>
                    <Typography variant="h6" className="light-text">{user.email}</Typography>
                    <hr/>
                    <Logout/>
                </div> : null}
        </Menu></Toolbar>

}