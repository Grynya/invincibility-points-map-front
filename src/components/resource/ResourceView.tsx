import Resource from "../../model/Resource";
import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import HelpIcon from "@mui/icons-material/Help";

export default function ResourceView({ resource }: { resource: Resource }) {
    return (
        <Typography key={resource.id}>
            {resource.name.toUpperCase()}
            <Tooltip title={resource.description} key={resource.id}>
                <HelpIcon sx={{ fontSize: "small" }} />
            </Tooltip>
        </Typography>
    );
}
