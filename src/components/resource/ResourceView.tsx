import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import * as React from "react";
import {Typography} from "@material-ui/core";
import Resource from "../../model/Resource";

export default function ResourceView({resource}: { resource: Resource }) {
    return <Typography>
        {resource.name.toUpperCase()}
        <Tooltip title={resource.description}>
            <HelpIcon sx={{fontSize: 'small', ml: 1}}/>
        </Tooltip>
    </Typography>
}