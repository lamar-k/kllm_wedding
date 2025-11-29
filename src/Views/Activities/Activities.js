import React, { useState, useEffect } from "react";
import Navigation from "../../Components/Navigation/Navigation";
import Chat from "./Chat";
import Map from "./Map";
import './Activities.css';

const Activities = () => {
    const [locations, setLocations] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    const handleNewMessage = (message) => {
        setChatMessages(prev => [...prev, message]);
        extractLocations(message);
    };

    const locationDatabase = {
        'washington monument': { name: 'Washington Monument', lat: 38.8895, lng: -77.0353 },
        'lincoln memorial': { name: 'Lincoln Memorial', lat: 38.8893, lng: -77.0502 },
        'national mall': { name: 'National Mall', lat: 38.8895, lng: -77.0236 },
        'smithsonian': { name: 'Smithsonian Institution', lat: 38.8880, lng: -77.0260 },
        'capitol hill': { name: 'Capitol Hill', lat: 38.8899, lng: -77.0091 },
        'capitol': { name: 'U.S. Capitol', lat: 38.8899, lng: -77.0091 },
        'georgetown': { name: 'Georgetown', lat: 38.9098, lng: -77.0654 },
        'dupont circle': { name: 'Dupont Circle', lat: 38.9097, lng: -77.0434 },
        'adams morgan': { name: 'Adams Morgan', lat: 38.9220, lng: -77.0434 },
        'white house': { name: 'White House', lat: 38.8977, lng: -77.0365 },
        'jefferson memorial': { name: 'Jefferson Memorial', lat: 38.8814, lng: -77.0365 },
        'national gallery': { name: 'National Gallery of Art', lat: 38.8914, lng: -77.0200 },
        'air and space museum': { name: 'National Air and Space Museum', lat: 38.8882, lng: -77.0199 },
        'natural history museum': { name: 'National Museum of Natural History', lat: 38.8913, lng: -77.0260 },
        'holocaust museum': { name: 'United States Holocaust Memorial Museum', lat: 38.8869, lng: -77.0330 },
        'arlington cemetery': { name: 'Arlington National Cemetery', lat: 38.8783, lng: -77.0687 },
        'pentagon': { name: 'The Pentagon', lat: 38.8719, lng: -77.0563 },
        'union station': { name: 'Union Station', lat: 38.8977, lng: -77.0062 },
    };

    const extractLocations = (message) => {
        const messageLower = message.text.toLowerCase();
        
        Object.keys(locationDatabase).forEach(key => {
            if (messageLower.includes(key)) {
                const locationData = locationDatabase[key];
                if (!locations.find(loc => loc.name === locationData.name)) {
                    const newLocation = {
                        id: Date.now() + Math.random(),
                        name: locationData.name,
                        lat: locationData.lat,
                        lng: locationData.lng,
                        addedBy: message.user,
                        timestamp: new Date()
                    };
                    setLocations(prev => [...prev, newLocation]);
                }
            }
        });
    };

    return (
        <div className="activities">
            <Navigation />
            <div className="activities-container">
                <div className="activities-header">
                    <p>Chat about activities and see them appear on the map!</p>
                </div>
                <div className="activities-content">
                    <div className="chat-section">
                        <Chat onNewMessage={handleNewMessage} messages={chatMessages} />
                    </div>
                    <div className="map-section">
                        <Map locations={locations} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;

