import React from "react";
import { IconButton, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const SearchField = ({sx, input, setInput}) => {
    const handle = (f) => (event) => {
        setInput(event.target.value)
        f(event.target.value)
    }

    return <TextField
        label = "Wpisz dane o leku"
        variant = "filled"
        onChange={handle(setInput)}
        sx = {sx}
        value={input}
        InputProps = {{
            endAdornment: (
                <IconButton
                    onClick = {() => setInput("")}
                >
                    <ClearIcon/>
                </IconButton>
            )
        }}
    />
}

export default SearchField;