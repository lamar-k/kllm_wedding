import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import RsvpModal from "../RsvpModal/RsvpModal";
import './Navigation.css';

function Navigation() {
    const location = useLocation();
    const currentPath = location.pathname;
    const [menuOpen, setMenuOpen] = useState(false);
    const [rsvpOpen, setRsvpOpen] = useState(false);

    const getNavClass = (path) => {
        return currentPath === path ? "nav-link active" : "nav-link";
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <div>
            {currentPath !== "/" && (
                <div className="nav-rsvp-wrapper">
                    <Button
                        variant="outlined"
                        onClick={() => setRsvpOpen(true)}
                        sx={{
                            color: 'black',
                            transition: 'box-shadow 0.3s ease-in-out',
                            borderColor: 'black',
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
            )}
            <nav className="nav-bar">
                <button
                    className="hamburger-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>
                <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
                    <Link to="/" className={getNavClass("/")} onClick={handleLinkClick}>Home</Link>
                    <Link to="/schedule" className={getNavClass("/schedule")} onClick={handleLinkClick}>Schedule</Link>
                    <Link to="/travel" className={getNavClass("/travel")} onClick={handleLinkClick}>Travel</Link>
                    <Link to="/things-to-do" className={getNavClass("/things-to-do")} onClick={handleLinkClick}>Activities in D.C.</Link>
                    <Link to="/gallery" className={getNavClass("/gallery")} onClick={handleLinkClick}>Gallery</Link>
                    <Link to="/registry" className={getNavClass("/registry")} onClick={handleLinkClick}>Registry</Link>
                    <Link to="/faq" className={getNavClass("/faq")} onClick={handleLinkClick}>FAQs</Link>
                </div>
            </nav>
            <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
        </div>
    );
}

export default Navigation;