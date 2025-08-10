import React from "react";
import { Button } from "@mui/material";

const MapRedirectFunction = ({latitude, longitude, label = 'Location'}) => {
    const handleRedirect = () => {
        const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${label}`;  
        window.open(googleMapsURL);
    };

    return (
        <div>
            <Button sx={{color:'black', 
            transition: 'box-shadow 0.3s ease-in-out',
        '&:hover':{
            boxShadow: '0 0 0 2px black',
            backgroundColor:'white',
        }}} onClick={handleRedirect} className="map-redirect-button">
                Map
            </Button>
        </div>
    );
}
export default MapRedirectFunction;