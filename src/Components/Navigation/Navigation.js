import React from "react";
import { Link, useLocation } from "react-router-dom";
import './Navigation.css';

function Navigation() {
    const location = useLocation();
    const currentPath = location.pathname;

    const getNavClass = (path) => {
        return currentPath === path ? "nav-link active" : "nav-link";
    }
    return(
        <div>
            <nav className="nav-bar">
                <Link to="/" className={getNavClass("/")}>Home</Link>
                <Link to="/schedule" className={getNavClass("/schedule")}>Schedule</Link>
                <Link to="/travel" className={getNavClass("/travel")}>Hotel/Accomodations</Link>
                <Link to="/things-to-do" className={getNavClass("/things-to-do")}>Activities in D.C.</Link>
                <Link to="/gallery" className={getNavClass("/gallery")}>Gallery</Link>
                <Link to="/registry" className={getNavClass("/registry")}>Registry</Link> 
                <Link to="/rsvp" className={getNavClass("/svp")}>RSVP</Link> 
                <Link to="/faq" className={getNavClass("/faq")}>FAQs</Link> 
            </nav>
    </div>
    )
}

export default Navigation;