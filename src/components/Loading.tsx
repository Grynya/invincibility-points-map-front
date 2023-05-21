import React from "react";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

const Loading = () => (
    <Box
        display="flex"
        width="100%" height="100vh">
        <Box m="auto">
            <CircularProgress size={80} color="inherit"/>
        </Box>
    </Box>
);
export default Loading;