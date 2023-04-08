import Resource from "../../model/Resource";
import {Checkbox, FormControlLabel, FormGroup, InputLabel, List, ListItem} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import * as React from "react";

export default function CheckboxResources ({resources}: { resources: Resource[] | null }) {

    if (resources !== null)
        return (
            <FormGroup sx={{mt: 3, mb: 1}}>
                <InputLabel>Наявні ресурси</InputLabel>
                <List>
                    {resources.map((resource: Resource) => {
                        return (
                            <ListItem key={resource.id}>
                                <Tooltip title={resource.description}>
                                    <FormControlLabel
                                        key={resource.id}
                                        control={<Checkbox/>}
                                        label={
                                            <>
                                                {resource.name}
                                                <HelpIcon sx={{fontSize: 'small', ml: 1}}/>
                                            </>
                                        }
                                    />
                                </Tooltip>
                            </ListItem>
                        )
                    })}
                </List>
            </FormGroup>
        )
    else return null
}