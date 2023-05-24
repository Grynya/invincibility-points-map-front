import React from "react";
import authService from "../../service/AuthService";
import {useNavigate} from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {MenuItem} from "@mui/material";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.signout(()=>{
            navigate("/login");
        });
    };

    return (
        <MenuItem onClick={handleLogout} >
            <PersonAddIcon/>
            <span>Вийти</span>
        </MenuItem>
    );
};

export default Logout;