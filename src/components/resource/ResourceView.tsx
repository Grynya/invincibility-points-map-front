import Resource from "../../model/Resource";
import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import HelpIcon from "@mui/icons-material/Help";

export default function ResourceView({ resource }: { resource: Resource }) {
    return (
        <React.Fragment key={resource.id}>
            <Typography key={resource.id}>
                {resource.id}. {resource.name.toUpperCase()}
            </Typography>
            <Tooltip title={resource.description}>
                <HelpIcon sx={{ fontSize: "small", ml: 1 }} />
            </Tooltip>
        </React.Fragment>
    );
}
