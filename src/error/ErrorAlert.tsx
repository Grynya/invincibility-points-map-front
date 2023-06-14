import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useSelector} from 'react-redux';
import {StoreState} from "../store/StoreState";
import {store} from "../store/store";
import {changeError} from "../store/actionCreators/changeError";

const ErrorAlert = () => {
    const errorOpen = useSelector((state:StoreState) => state.errorOpen);
    const errorMessage = useSelector((state:StoreState) => state.errorMessage);

    const handleClose = () => store.dispatch(changeError(null));

    return (
        <Snackbar
            open={errorOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
                {errorMessage ? errorMessage : 'Виникла помилка'}
            </MuiAlert>
        </Snackbar>
    );
};

export default ErrorAlert;
