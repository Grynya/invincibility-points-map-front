import React from "react";
import authService from "../../service/AuthService";
import {useNavigate} from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {MenuItem} from "@mui/material";
import {Typography} from "@material-ui/core";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.signout(()=>{
            navigate("/login");
        });
    };

    return (
        <MenuItem onClick={handleLogout} style={{height: '80px'}}>
            <PersonAddIcon fontSize="large"/>
            <Typography style={{fontSize: 'large'}}>Вийти</Typography>
        </MenuItem>
    );
};

export default Logout;