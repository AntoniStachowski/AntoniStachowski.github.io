import {Fab } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import Logo from "../assets/logo2copy.svg";
import SearchIcon from '@mui/icons-material/Search';
import MedInfoDialog from "./MedInfoDialog";
import SnackBar from "./SnackBar";
import SearchField from "./utils/SearchField";
import { requestPath } from "./utils/utils";
import FabPDF from './FabPDF';
import LoadingPage from "./LoadingPage";
import { escapeChar } from "./utils/escapeChars";
import { ErrorContext } from "./errors";

const ref = React.createRef();

const SearchResults = () => {
    const [meds, setMeds] = useState([]);
    const [medsDuplicates, setMedsDuplicates] = useState([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [clickedMed, setClickedMed] = useState({});
    //const {searchPhrase, setSearchPhrase} = useContext(MedContext);
    let searchPhraseToContext = ""; 
    const [input, setInput] = useState("");
    const [refunds, setRefunds] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const {setErrorMessage} = useContext(ErrorContext);

    const [waitForMeds, setWaitForMeds] = useState(false);
    const getMedsLikeSearch = async () => {
        setWaitForMeds(true);
        searchPhraseToContext = localStorage.getItem("searchPhraseContext");
        const phrase = input === "" ? searchPhraseToContext : input;
        let phraseFixed = phrase;
        for (let i = 0; i < escapeChar.length; i++) {
            phraseFixed = phraseFixed.replace(escapeChar[i].regexLiteral, escapeChar[i].replacement);
        }
        const medsLikeSearch = await fetch(`${requestPath}/drugs?search=${phraseFixed}`, {
            method: 'GET'
        });
        
        const medsLikeSearchJson = await medsLikeSearch.json();
        const medsLikeSearchJsonSorted
            = await medsLikeSearchJson.sort(
                (a, b) => {
                    if ((a.name > b.name)
                    || (a.name === b.name && a.formDose > b.formDose)
                    || (a.name === b.name && a.formDose === b.formDose && a.content > b.content)) return 1;
                    if (a.name === b.name && a.formDose === b.formDose && a.content === b.content) return 0;
                    return -1;
                }
            );
        let medsLikeSearchJsonSortedNoDuplicates = [];
        medsLikeSearchJsonSorted.forEach(element => {
            let wasDuplicate = false;
            medsLikeSearchJsonSortedNoDuplicates.forEach(element2 => {
                if (element.name === element2.name && element.formDose === element2.formDose && element.content === element2.content) {
                    wasDuplicate = true;
                }
            });
            if (!wasDuplicate) {
                medsLikeSearchJsonSortedNoDuplicates.push(element);
            }
        });
        setMedsDuplicates(medsLikeSearchJsonSorted);
        setMeds(medsLikeSearchJsonSortedNoDuplicates);
        setWaitForMeds(false);
    }

    useEffect(() => {
        setInput(localStorage.getItem("searchPhraseContext"));
        getMedsLikeSearch();
    }, [])

    const handleSearchButtonOnClick = async () => {
        if(disabled) {
            return;
        }
        setDisabled(true);
        //setSearchPhrase(input);
        localStorage.setItem("searchPhraseContext", input);
        await getMedsLikeSearch();
        setDisabled(false);
    }

    const handleOnClick = async (med, key) => {
        setIsDialogOpen(true);
        setClickedMed({key: key, ...med})

        let medRefunds = [];
        medsDuplicates.forEach(meddd => {
            if (med.name === meddd.name && med.formDose === meddd.formDose && med.content === meddd.content) {
                medRefunds.push(meddd.refund);
            }
        });

        medRefunds = [... new Set(medRefunds)];
        
        setRefunds(medRefunds);
    }

    return (
        <div>
            {waitForMeds || disabled
                ?
                <div style = {{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                }}>
                    <LoadingPage/>
                </div>
                :
                <div></div>
            }
            <div style = {{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
                opacity: waitForMeds ? 0.5 : 1,
            }} ref={ref}>
                <MedInfoDialog
                    isOpen = {isDialogOpen}
                    setIsOpen = {setIsDialogOpen}
                    clickedMed = {clickedMed}
                    refunds={refunds}
                />
                <SnackBar/>
                <div style = {{
                    width: "100vw",
                    position: "fixed",
                    zIndex: 100,
                    height: 120,
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    borderBottom: "1px solid #707070",
                    backgroundImage: `url(${Logo})`,
                    backgroundSize: "auto 80px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top 20px left 30px",
                    backgroundColor: "#000000"
                }} id="logo">
                    <SearchField
                        sx = {{maxWidth: 600, flex: 1, marginLeft: 20}}
                        input = {input}
                        setInput={setInput}
                    />
                    <Fab
                        color = "primary"
                        sx = {{marginLeft: 4}}
                        onClick={handleSearchButtonOnClick}
                    >
                        <SearchIcon/>
                    </Fab>
                    <FabPDF/>
                    
                </div>
                <div style={{marginLeft: 160, marginTop: 120}}>
                    {meds.map((med, key) => 
                        <div
                            key = {key}
                            style = {{
                                borderRadius: 20,
                                maxWidth: 712,
                                margin: "25px 0 25px 0",
                                padding: "20px 25px 20px 25px",
                                marginLeft: "-25px",
                                transition: "background-color 200ms linear",
                                fontSize: 20,
                            }}
                            onMouseOver = {(event) => event.target.style.background = "#404040"}
                            onMouseLeave = {(event) => event.target.style.background = "none"}
                            onClick = {(
                                med.isAvailable)
                                ? () => handleOnClick(med, key)
                                : () => {setErrorMessage("Lek niedostępny")
                            }}
                        >
                            <div style = {{
                                pointerEvents: "none",
                                lineHeight: 2,
                                fontSize: 24,
                                color: med.isAvailable ? "#ffc107" : "#c0c0c0"
                            }}>
                                <b>{med.name}</b>
                            </div>
                            {med.formDose}, {med.content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchResults;
