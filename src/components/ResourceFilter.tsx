import * as React from "react";
import {useState} from "react";
import {Checkbox, FormControl, FormControlLabel, FormGroup, Typography,} from "@mui/material";
import {useSelector} from "react-redux";
import {StoreState} from "../store/StoreState";
import Container from "@mui/material/Container";
import {styled, Theme, useTheme} from "@mui/material/styles";

const drawerWidth = 540;

const Resource = styled('div', {shouldForwardProp: (prop) => prop !== 'open'})<{ theme: Theme, open: boolean }>(
    ({theme, open}) => ({
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        }),
    }),
);
export default function ResourceFilter({open}:
                                           {
                                               userId: number | undefined,
                                               open: boolean
                                           }) {
    const theme = useTheme();
    const resources = useSelector((state: StoreState) => state.resources);
    const [selected, setSelected] = useState<number[]>([]);

    const handleCheckboxChange = (id: number) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((i) => i !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    return (
        <Resource open={open} theme={theme}>
            <Container maxWidth="md">
                <FormControl component="fieldset">
                    <Typography variant="h5" gutterBottom>
                        <strong>Фільтр по ресурсам</strong>
                    </Typography>
                    <FormGroup row>
                        {resources ? resources.map((resource) => (
                            <FormControlLabel
                                key={resource.id}
                                control={
                                    <Checkbox
                                        checked={selected.includes(resource.id)}
                                        onChange={() => handleCheckboxChange(resource.id)}
                                    />
                                }
                                label={resource.name}
                            />
                        )) : null}
                    </FormGroup>
                </FormControl>
            </Container>
        </Resource>
    );
}
