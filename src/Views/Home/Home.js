import React, { useState } from "react";
import './Home.css';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import { Button } from "@mui/material";
import RsvpModal from "../../Components/RsvpModal/RsvpModal.js";
import seasideImg from '../../images/seaside.jpg';

function Home() {
    const [rsvpOpen, setRsvpOpen] = useState(false);

    return (
        <div className="home">
            <Navigation/>
            <img src={seasideImg} alt="Seaside" className="hero-banner" />
            <div className="wedding-details">
                <p className="wedding-date">June 13, 2026</p>
                <p className="wedding-location">Washington, D.C.</p>
            </div>
            <Countdown/>

            <div>
                <Button
                    variant="outlined"
                    onClick={() => setRsvpOpen(true)}
                    sx={{
                        color: 'black',
                        transition: 'box-shadow 0.3s ease-in-out',
                        borderColor: 'black',
                        marginBottom: '20px',
                        '&:hover': {
                            color: 'white',
                            borderColor: 'white',
                            backgroundColor: 'black',
                        },
                    }}
                >
                    RSVP HERE
                </Button>
            </div>

            <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
        </div>
    );
}

export default Home;
