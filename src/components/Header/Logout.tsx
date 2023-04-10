import React from "react";
import authService from "../../service/AuthService";
import {useNavigate} from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {MenuItem} from "@mui/material";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate("/login"); // Replace "/login" with the route you want to navigate to after logout
    };

    return (
        <MenuItem onClick={handleLogout}>
            <PersonAddIcon style={{margin: 5}}/>
            Вийти
        </MenuItem>
    );
};

export default Logout;