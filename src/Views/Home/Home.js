import React from "react";
import weddingLogo from "../../images/LK_CREST_BLACK_WHITE.png";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import LKIMAGE from "../../images/LK_HOME.png";

function Home() {
    return (
        <div className="home">
            <div>
                <img src={weddingLogo} alt="LK Wedding Logo" className="logo"
                style={{display:'flex', width:'100%', maxHeight:'20vh', objectFit:'contain', marginBottom:'-10px', marginTop:'10px'}}
                />
            </div>
            <div className="header-text">
               <h2 style={{color:'black'}} className="script_text">Lauren + Ken</h2>
               <h3 style={{color:'black'}} className="script_subtext">June 13, 2026 &emsp; | &emsp; Washington, D.C.</h3>
            </div>
            <Countdown/>

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