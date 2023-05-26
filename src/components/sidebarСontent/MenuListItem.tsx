import {ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

export default function MenuListItem({ icon, text, onClick }:{icon:React.ReactNode, text:string, onClick:React.MouseEventHandler}) {
    return (
        <MenuItem onClick={onClick} style={{ height: '80px' }}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>
                <Typography style={{ fontSize: 'x-large' }}>{text}</Typography>
            </ListItemText>
        </MenuItem>
    );
}