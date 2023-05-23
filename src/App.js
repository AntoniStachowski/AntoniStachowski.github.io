import './App.css';
import { createTheme, CssBaseline, Fab, ThemeProvider } from '@mui/material';
import { amber, pink } from '@mui/material/colors';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import MedSubstitutes from './components/MedSubstitutes';
import { Errors } from './components/errors';
import { MedInfo } from './components/medInfo';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

function App() {
    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: pink,
            secondary: amber
        }
    });

    return (
        <ThemeProvider theme = {theme}>
            <Errors>
                <MedInfo>
                    <CssBaseline/>
                    <HashRouter>
                        <Routes>
                            <Route path = "" element = {<Search/>}/>
                            <Route path = "searchResults" element = {<SearchResults/>}/>
                            <Route path = "substitutes" element = {<MedSubstitutes/>}/>
                        </Routes>
                    </HashRouter>
                </MedInfo>
            </Errors>
        </ThemeProvider>
    );
}

export default App;
