import {Fab, IconButton, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/logo2copy.svg";
import SearchIcon from '@mui/icons-material/Search';
import MedInfoDialog from "./MedInfoDialog";
import SnackBar from "./SnackBar";
import { MedContext } from "./medInfo";
import SearchField from "./utils/SearchField";
import { requestPath } from "./utils/utils";

const SearchResults = () => {
    const [meds, setMeds] = useState([]);
    const [medsDuplicates, setMedsDuplicates] = useState([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [clickedMed, setClickedMed] = useState({});
    const {searchPhrase, setSearchPhrase} = useContext(MedContext);
    const [input, setInput] = useState("");
    const [refunds, setRefunds] = useState([]);
    
    const getMedsLikeSearch = async () => {
        const phrase = input === "" ? searchPhrase : input;
        const medsLikeSearch = await fetch(`${requestPath}/drugs?search=${phrase}`, {
            method: 'GET'
        });
        
        const medsLikeSearchJson = await medsLikeSearch.json();
        console.log(medsLikeSearchJson);
        const medsLikeSearchJsonSorted
            = await medsLikeSearchJson.sort(
                (a, b) =>
                    (a.name > b.name)
                    || (a.name == b.name && a.formDose > b.formDose)
                    || (a.name == b.name && a.formDose == b.formDose && a.content > b.content)
            );
        let medsLikeSearchJsonSortedNoDuplicates = [];
        medsLikeSearchJson.forEach(element => {
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
        medsLikeSearchJsonSortedNoDuplicates = 
            await medsLikeSearchJsonSortedNoDuplicates.sort(
                (a, b) =>
                    (a.name > b.name)
                    || (a.name == b.name && a.formDose > b.formDose)
                    || (a.name == b.name && a.formDose == b.formDose && a.content > b.content)
            );
        setMedsDuplicates(medsLikeSearchJsonSorted);
        setMeds(medsLikeSearchJsonSortedNoDuplicates);
    }

    useEffect(() => {
        setInput(searchPhrase);
        getMedsLikeSearch();
    }, [])

    const handleSearchButtonOnClick = () => {
        setSearchPhrase(input);
        getMedsLikeSearch();
    }

    const handleOnClick = (med, key) => {
        setIsDialogOpen(true);
        setClickedMed({key: key, ...med})

        let medRefunds = [];
        medsDuplicates.forEach(meddd => {
            if (med.name === meddd.name && med.formDose === meddd.formDose && med.content === meddd.content) {
                medRefunds.push(meddd.refund);
            }
        });
        
        setRefunds(medRefunds);
    }

    return (
        <div style = {{display: "flex", flexDirection: "column", width: "100vw", height: "100vh"}}>
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
            }}>
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
                        onClick = {() => handleOnClick(med, key)}
                    >
                        <div style = {{pointerEvents: "none", lineHeight: 2, fontSize: 24, color: "#ffc107"}}>
                            <b>{med.name}</b>
                        </div>
                        {med.formDose}, {med.content}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResults;
