import { useTheme } from "@emotion/react";
import { Fab, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { fontFamily } from "@mui/system";
import React, { useEffect, useState } from "react";
import "../assets/fonts.css"
import { MedContext } from "./medInfo";
import { requestPath } from "./utils/utils";
import optimise from "./utils/optimise";
import FabPDF from "./FabPDF";

var chosenMed = JSON.parse(localStorage.getItem("chosenMed"));

const MedSubstitutes = () => {
    const theme = useTheme();
    //const {chosenMed, setMedInfo} = React.useContext(MedContext);
    var boxAmount = localStorage.getItem("boxAmount");
    var refund = localStorage.getItem("refund");
    const medPropertiesWithStyle = [
        {
            name: "name",
            desc: "Nazwa",
            widthPercentage: 1
        },
        {
            name: "formDose",
            desc: "Postać i dawka",
            widthPercentage: 1.5
        },
        {
            name: "activeIngredient",
            desc: "Substancja czynna",
            widthPercentage: 1.5
        },
        {
            name: "content",
            desc: "Zawartość opakowania",
            widthPercentage: 1.5
        },
        {
            name: "upcharge",
            desc: "Cena detaliczna",
            widthPercentage: 0.5
        },
        {
            name: "boxAmount",
            desc: "Liczba pudełek",
            widthPercentage: 0.5
        },
        {
            name: "refund",
            desc: "Poziom refundacji",
            widthPercentage: 1
        },
    ];

    const resultWidth = 1;
    const widthSum = resultWidth + medPropertiesWithStyle.reduce(function(a,b){
        return a+b.widthPercentage;
    }, 0);

    const medPropertiesFewer = [
        {
            name: "name",
            desc: "Nazwa",
            widthPercentage: 1
        },
        {
            name: "dose",
            desc: "Dawka",
            widthPercentage: 1.5
        },
        {
            name: "content",
            desc: "Zawartość opakowania",
            widthPercentage: 1.5
        },
        {
            name: "upcharge",
            desc: "Cena detaliczna",
            widthPercentage: 0.5
        },
        {
            name: "boxAmount",
            desc: "Liczba pudełek",
            widthPercentage: 0.5
        },
    ];

    const [substitutes, setSubstitutes] = useState([]);

    const changeChosenMed = () => {
        chosenMed = JSON.parse(localStorage.getItem("chosenMed"));
        chosenMed = 
            {
                boxAmount: localStorage.getItem("boxAmount"),
                ...chosenMed,
                refund: localStorage.getItem("refund"),
                //add " zł" to upcharge if it's not there
                upcharge: String(chosenMed.upcharge).includes("zł") ? chosenMed.upcharge : chosenMed.upcharge + " zł"
            };
        console.log(chosenMed);
    }

    const getSubstitutes = async () => {
        console.log(chosenMed);
        const substitutes = await fetch(`${requestPath}/drugs/${chosenMed.id}`, {
            method: 'GET'
        });
        const substitutesJson = await substitutes.json();
        const realSubstitutes =
            optimise(substitutesJson, chosenMed.id, boxAmount, refund)
            .map(({price, amount, substitute}) => ({
                price,
                substitute: {
                    ...substitute,
                    boxAmount: amount,
                    upcharge: substitute.upcharge + " zł",
                }
                
            }));
        console.log(realSubstitutes);
        setSubstitutes(realSubstitutes);
    }

    useEffect(() => {
        changeChosenMed();
        getSubstitutes();
    }, []);

    return (
        <div style = {{padding: "0 20px 20px 20px"}}>
            <FabPDF/>
            <Typography sx = {{
                width: "calc(100vw - 40px)",
                height: 125,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: theme.palette.primary[500],
                fontWeight: 800
            }}>
                Znalezione zamienniki
            </Typography>
            <Typography sx = {{color: theme.palette.secondary[500], fontSize: 27, fontWeight: 800, margin: "20px 20px 20px 50px"}}>
                Wybrany lek
            </Typography>
            <Table /*style = {{tableLayout: "fixed"}}*/ sx = {{ marginBottom: 6}}>
                <TableHead>
                    {medPropertiesWithStyle.map((feature, key) =>
                        <TableCell
                            key = {key}
                            sx = {{
                                fontSize: 20,
                                backgroundColor: "#0a0a0a",
                                borderTopLeftRadius: key === 0 ? 20 : 0,
                            }}
                            width={`${feature.widthPercentage*100/widthSum}%`}
                        >
                            {feature.desc}
                        </TableCell>
                        
                    )}
                    <TableCell
                        sx = {{
                            fontSize: 20,
                            backgroundColor: "#0a0a0a",
                            borderTopRightRadius: 20,
                            color: theme.palette.primary[300]
                        }}
                        width = {`${resultWidth * 100 / widthSum}%`}
                    >
                        Łączna cena
                    </TableCell>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {medPropertiesWithStyle.map((feature, key) =>
                            <TableCell
                                key = {key}
                                sx = {{
                                    fontSize: 20,
                                    backgroundColor: "#303030",
                                    //color: theme.palette.primary[300],
                                    borderBottomLeftRadius: key === 0 ? 20 : 0,
                                    border: "0px solid",
                                    fontWeight: 800
                                }}
                            >
                                {chosenMed[feature.name]}
                            </TableCell>
                        )}
                        <TableCell
                            sx = {{
                                fontSize: 20,
                                fontWeight: 800,
                                backgroundColor: "#303030",
                                borderBottomRightRadius: 20,
                                border: "0px solid",
                                color: theme.palette.primary[300]
                            }}
                        >
                            {(parseInt(boxAmount) * parseFloat(chosenMed.upcharge)).toFixed(2)} zł
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Typography sx = {{color: theme.palette.secondary[500], fontSize: 27, fontWeight: 800, margin: "20px 20px 20px 50px"}}>
                Zamienniki
            </Typography>
            <Table style = {{tableLayout: "fixed"}}>
                <TableHead>
                    {medPropertiesFewer.map((feature, key) =>
                        <TableCell
                            key = {key}
                            sx = {{
                                fontSize: 20,
                                backgroundColor: "#000000",
                                borderTopLeftRadius: key === 0 ? 20 : 0,
                            }}
                        >
                            {feature.desc}
                        </TableCell>
                    )}
                    <TableCell
                        sx = {{
                            fontSize: 20,
                            backgroundColor: "#000000",
                            borderTopRightRadius: 20,
                            color: theme.palette.primary[300]
                        }}
                    >
                        Łączna cena
                    </TableCell>
                </TableHead>
                <TableBody>
                    {substitutes.map((substitute, keyS) =>
                        <TableRow key = {keyS}>
                            {medPropertiesFewer.map((feature, key) =>
                            <TableCell
                                key = {key}
                                sx = {{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    backgroundColor: (keyS % 2 === 1) ? "#202020" : "none"
                                }}
                            >
                                {substitute.substitute[feature.name]}
                                {feature.name === "dose" ? " " + substitute.substitute.unit : ""}
                            </TableCell>
                        )}
                        <TableCell
                            sx = {{
                                fontSize: 20,
                                fontWeight: 800,
                                backgroundColor: (keyS % 2 === 1) ? "#202020" : "none",
                                color: theme.palette.primary[300]
                            }}
                        >
                            {(parseFloat(substitute.price)).toFixed(2)} zł
                        </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default MedSubstitutes;
