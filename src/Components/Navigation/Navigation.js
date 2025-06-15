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
            </nav>
    </div>
    )
}

export default Navigation;