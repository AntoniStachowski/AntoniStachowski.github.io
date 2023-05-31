import { TextField, Paper, Button, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import Logo from "../assets/logo2copy.svg";
import "../assets/fonts.css"
import { useNavigate } from "react-router-dom";
import { MedContext } from "./medInfo";
import SearchField from "./utils/SearchField";

const Search = () => {
    const navigate = useNavigate();
    const {setSearchPhrase} = useContext(MedContext);
    const [input, setInput] = useState("");

    const handleSearchButtonOnClick = () => {
        //let inputFixed = input.replace("%", "%25").replace(/\\/, "%5c").replace("|", "%7c");
        setSearchPhrase(input);
        //out input to local storage
        localStorage.setItem("searchPhraseContext", input);
        navigate("/searchResults");
    }
//2x = (100vh - 176) / 2 - h
    return (
        <div style = {{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${Logo})`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "auto 25vh",
            backgroundPosition: "center top calc(((100vh - 176px - 80px) / 2 - 25vh) / 2)"
        }}>
            <div style = {{width: 600}}>
                <Typography
                    color = "secondary"
                    style = {{
                        letterSpacing: 10,
                        fontSize: 50,
                        display: "flex",
                        justifyContent: "center",
                        paddingBottom: 20,
                        fontFamily: "Mrs Sheppards",
                    }}
                >
                    Jaskółka
                </Typography>
                <Paper sx = {{
                    padding: 3,
                    display: "flex",
                    maxWidth: 600,
                    flexDirection: "row",
                    flexGrow: 1
                }}>
                    <div style = {{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%"
                    }}>
                        <SearchField
                            sx = {{marginBottom: 2}}
                            input = {input}
                            setInput = {setInput}
                        />
                        
                        <Button
                            sx = {{width: "100%", marginTop: 1, height: 48}}
                            variant = "contained"
                            onClick = {handleSearchButtonOnClick}
                        >
                            Szukaj
                        </Button>
                    </div>
                </Paper>
            </div>
        </div>
    );
}

export default Search;