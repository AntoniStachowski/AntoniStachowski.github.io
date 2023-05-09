import React, { useState } from "react";

export const MedContext = React.createContext();

export function MedInfo(props) {
    const [ searchPhrase, setSearchPhrase ] = useState();
    const [ chosenMed, setChosenMed ] = useState();

    const setMedInfo = (_boxAmount, _refundLevel, _chosenMed) => {
        setChosenMed({
            ..._chosenMed,
            refund: _refundLevel,
            boxAmount: _boxAmount
        });
    }

    return <MedContext.Provider
        value = {{
            searchPhrase,
            setSearchPhrase,
            chosenMed,
            setMedInfo,
        }}
    >
        {props.children}
    </MedContext.Provider>
}