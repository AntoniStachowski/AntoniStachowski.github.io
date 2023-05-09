import { Alert, Snackbar } from "@mui/material";
import React, { useContext } from "react";
import { ErrorContext } from "./errors.js";

const SnackBar = () => {
    const {
        isMessageOn,
        currentSeverity,
        currentMessage,
        setErrorMessage
    } = useContext(ErrorContext);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setErrorMessage("");
    }
    
    return <Snackbar
        open = {isMessageOn}
        autoHideDuration = {2000}
        onClose = {handleCloseSnackBar}
    >
        <Alert
            variant = "filled"
            severity = {currentSeverity}
            sx = {{fontSize: "1rem", letterSpacing: "0.125rem"}}
        >
            {currentMessage}
        </Alert>
    </Snackbar>
}

export default SnackBar;