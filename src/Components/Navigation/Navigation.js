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
                <Link to="/about-us" className={getNavClass("about-us")}>About Us</Link>
                <Link to="/travel" className={getNavClass("travel")}>Travel</Link>
                <Link to="/things-to-do" className={getNavClass("things-to-do")}>Things To Do</Link>
                <Link to="/photos" className={getNavClass("photos")}>Photos</Link>
                <Link to="/registry" className={getNavClass("registry")}>Registry</Link> 
            </nav>
    </div>
    )
}

export default Navigation;