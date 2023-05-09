import React, { useState } from "react";

export const ErrorContext = React.createContext();

export function Errors(props) {
    const [ isMessageOn, setIsMessageOn ] = useState(true);
    const [ currentMessage, setCurrentMessage ] = useState("");
    const [ currentSeverity, setCurrentSeverity] = useState("");

    const setErrorMessage = (message) => {
        if (message === "") {
            setIsMessageOn(false);
            setCurrentMessage("");
            return;
        }

        setIsMessageOn(true);
        setCurrentMessage(message);
        setCurrentSeverity("error");
    }

    return <ErrorContext.Provider
        value = {{
            isMessageOn,
            currentMessage,
            currentSeverity,
            setErrorMessage
        }}
    >
        {props.children}
    </ErrorContext.Provider>
}