import Resource from "../../model/Resource";
import {Checkbox, FormControlLabel, FormGroup, InputLabel, List, ListItem} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import * as React from "react";
import {useState} from 'react';
import {Typography} from "@material-ui/core";

export default function CheckboxResources({
                                              resources,
                                              selectedResources,
                                              setSelectedResources
                                          }: { resources: Resource[] | null, selectedResources: Resource[],
    setSelectedResources: (resources: Resource[]) => void }) {
    const [warning, setWarning] = useState<string | null>(null);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, resource: Resource) => {
        if (event.target.checked) {
            setSelectedResources([...selectedResources, resource]);
        } else {
            const newSelectedResources = selectedResources.filter((r) => r.id !== resource.id);
            if (newSelectedResources.length === 0) {
                setWarning('Потрібно вибрати принаймні один ресурс');
                return;
            }
            setSelectedResources(newSelectedResources);
        }
        setWarning(null);
    };

    if (resources !== null)
        return (
            <FormGroup sx={{mt: 3, mb: 1}}>
                <InputLabel>Наявні ресурси</InputLabel>
                <List>
                    {resources.map((resource: Resource) => {
                        return (
                            <ListItem key={resource.id}>
                                <FormControlLabel
                                    key={resource.id}
                                    control={<Checkbox
                                        checked={selectedResources.some((r) => r.id === resource.id)}
                                        onChange={(event) => handleCheckboxChange(event, resource)}/>}
                                    label={
                                        <>
                                            {resource.name}
                                            <Tooltip title={resource.description}>
                                                <HelpIcon sx={{fontSize: 'small', ml: 1}}/>
                                            </Tooltip>
                                        </>
                                    }
                                />
                            </ListItem>
                        )
                    })}
                </List>
                {warning && <Typography color="error">{warning}</Typography>}
            </FormGroup>
        )
    else return null
}
