import { CircularProgress, Fab, Tooltip } from "@mui/material";
import React from "react";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FabPDF = ({ }) => {
    const [clicked, setClicked] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const makePDF = async ()=> {
        console.log("makePDF");
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        var body = document.body,
        html = document.documentElement;
    
        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
        let displacement = 0;
        let canvasSize = 0;
        for (let i = 0; i < 100; i++) {
            if (i > 0) pdf.addPage('a4', 'p');
            await html2canvas(document.body, 
                {
                    scrollY: displacement,
                    y: displacement+120 * (i!=0),
                    backgroundColor: '#121212',
                    width: 1400,
                    height: Math.min(1400 * Math.sqrt(2), height-displacement),
                    windowWidth:1400,
                    windowHeight:Math.min(1400*Math.sqrt(2),
                    height-displacement
                )}).then( (canvas) => {
            
            let imgWidth = 210;
            let imgHeight = canvas.height * imgWidth / canvas.width;
            
            canvasSize = canvas.height;
            pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);})
            if(height-displacement < 1400*Math.sqrt(2)) break;
            displacement = displacement + canvasSize - 350 + 120*(i!=0);
            
        }
        // pdf.output('dataurlnewwindow'
        pdf.save("download.pdf");
    }

    const handleOnClick = async () => {
        setDisabled(true);
        setClicked(true);
        await makePDF();
        setClicked(false);
        setDisabled(false);
    }

    return (
        <div style = {{
            position: "absolute",
            right: 25, top: 25,
        }}>
            {/*<Fade in = {!clicked} timeout={400}>*/}
            <Tooltip title="Export to PDF" onClick={(!disabled) ? handleOnClick : () => {}}>
                {!clicked ?
                <Fab size="large" color="secondary" aria-label="add">
                    <PictureAsPdfIcon/>
                </Fab>
                :
                <CircularProgress color = "secondary"/>}
            </Tooltip>
            {/*</Fade>*/}
        </div>
    );
}

export default FabPDF;