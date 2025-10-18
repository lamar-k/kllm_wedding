import React from "react";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import LKIMAGE from "../../images/LK_HOME.png";
import {Button } from "@mui/material";


function Home() {
    return (
        <div className="home">
            <div className="header-text">
               <h2 style={{color:'black'}} className="script_text">Lauren + Ken</h2>
               <h3 style={{color:'black'}} className="script_subtext">June 13, 2026 &emsp; | &emsp; Washington, D.C.</h3>
            </div>
            <Countdown/>

            <div>
            <Button variant="outlined" sx={{color:'black', 
                    transition: 'box-shadow 0.3s ease-in-out', borderColor:'black'
                    , '&:hover': {color:'white', borderColor:'white', backgroundColor:'black'}}}>
                        RSVP HERE
                    </Button>
            </div>

            <Navigation/>

            <div style={{display:'flex', justifyContent:'center',  marginTop:'20px'}}>
            <img src={LKIMAGE} alt="LK Wedding Photo" className="LK"
                style={{display:'flex', width:'90%', maxHeight:'70vh', objectFit:'contain', marginBottom:'10px', marginTop:'10px'}} 
                />
            </div>

        </div>
    );
    }
export default Home;