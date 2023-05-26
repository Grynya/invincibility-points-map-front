import Button from "@mui/material/Button";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function ToMainButton(){
    const navigate = useNavigate();
    return <Button size="large"
        style={{margin: '10px 0', height:'40px', width: '200px', color:'black', border: 'solid black'}}
                   onClick={() => navigate('/')}>
        На головну
    </Button>
}