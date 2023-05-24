import Alert from '@mui/material/Alert';
import {IconButton} from "@mui/material";
import Collapse from '@mui/material/Collapse';
import Box from "@mui/material/Box";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    error: {
        message: string;
        visible: boolean;
    };
    setError: React.Dispatch<
        React.SetStateAction<{
            message: string;
            visible: boolean;
        }>
    >;
};

const ErrorAlert = ({ error, setError }: Props) => {
    return (
        <Box sx={{ width: '100%' }}>
            {error.visible && (
                <Collapse in={error.visible}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setError({ message: '', visible: false })}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2, mt:2 }}
                    >
                        {error.message}
                    </Alert>
                </Collapse>
            )}
        </Box>
    );
};

export default ErrorAlert;
