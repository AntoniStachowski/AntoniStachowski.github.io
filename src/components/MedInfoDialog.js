import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ErrorContext } from "./errors";
import { useNavigate } from "react-router-dom";

const MedInfoDialog = ({isOpen, setIsOpen, clickedMed, refunds}) => {
    const [refund, setRefund] = useState(refunds[0]);
    const [textFieldValue, setTextFieldValue] = useState("");

    useEffect(() => {
        setTextFieldValue("");
        setRefund(refunds[0]);
    }, [isOpen]);

    const navigate = useNavigate();
    const {setErrorMessage} = useContext(ErrorContext);

    const validate = () => {
        if (refund === "") {
            setErrorMessage("Wybierz poziom refundacji");
            return;
        }
        
        if (textFieldValue === "") {
            setErrorMessage("Wprowadź liczbę opakowań");
            return;
        }

        if (isNaN(textFieldValue)) {
            setErrorMessage("Wprowadź liczbę naturalną");
            return;
        }

        const naturalPattern = /^(0|([1-9]\d*))$/;

        if (textFieldValue <= 0 || 100000 <= textFieldValue
            || !naturalPattern.test(textFieldValue)
            || textFieldValue === Infinity) {
            setErrorMessage("Wprowadź poprawną liczbę opakowań");
            return;
        }

        setTextFieldValue("");
        setIsOpen(false);

        localStorage.setItem("boxAmount", textFieldValue);
        localStorage.setItem("refund", refund);
        localStorage.setItem("chosenMed", JSON.stringify(clickedMed));

        console.log("clickedMed: ", clickedMed);
        console.log("chosenMed: ", JSON.parse(localStorage.getItem("chosenMed")));
        //setMedInfo(textFieldValue, refund, clickedMed);
        navigate("/substitutes");
    }
    
    return (
        <Dialog
            open = {isOpen}
            onClose = {() => {setIsOpen(false)}}
        >
            <DialogTitle sx = {{padding: "25px 30px 25px 30px"}}>
                Podaj dane o leku {clickedMed.name}
            </DialogTitle>
            <DialogContent sx = {{width: 500}}>
                <TextField
                    fullWidth
                    variant="filled"
                    label = "Podaj liczbę opakowań"
                    sx = {{marginBottom: 4}}
                    value = {textFieldValue}
                    onChange = {(e) => setTextFieldValue(e.target.value)}
                />
                <TextField
                    fullWidth
                    select
                    label = "Podaj poziom refundacji"
                    value = {refund}
                    defaultValue={refunds[0]}
                    onChange = {(e) => setRefund(e.target.value)}
                    variant = "filled"
                >
                    {refunds.map((elem, key) =>
                        <MenuItem value = {elem} key = {key}>{elem}</MenuItem>
                    )}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick = {() => setIsOpen(false)}>Wyjdź</Button>
                <Button variant="contained" onClick = {validate}>Dalej</Button>
            </DialogActions>
        </Dialog>
    );
}

export default MedInfoDialog;
