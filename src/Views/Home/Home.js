import React from "react";
import weddingLogo from "../../images/LK_CREST_2.png";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';

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
               <h3 style={{color:'black'}} className="script_subtext">June 13th 2026 &middot; Washington D.C.</h3>
            </div>
            <Countdown/>

            <Navigation/>

        </div>
    );
    }
export default Home;