import React, { useState } from "react";
import Navigation from "../../Components/Navigation/Navigation";
import Chat from "./Chat";
import Map from "./Map";
import './Activities.css';

// Predefined locations for wedding venues and hotels
const PREDEFINED_LOCATIONS = [
    {
        id: 'graham-georgetown',
        name: 'The Graham Georgetown',
        lat: parseFloat(process.env.REACT_APP_GH_LAT) || 38.9023,
        lng: parseFloat(process.env.REACT_APP_GH_LONG) || -77.0624,
        type: 'venue',
        address: '1075 Thomas Jefferson St NW, Washington, DC 20007'
    },
    {
        id: 'iron-gate',
        name: 'The Iron Gate',
        lat: parseFloat(process.env.REACT_APP_IG_LAT) || 38.9066,
        lng: parseFloat(process.env.REACT_APP_IG_LONG) || -77.0422,
        type: 'venue',
        address: '1734 N St NW, Washington, DC 20036'
    },
    {
        id: 'church-key',
        name: 'The Church Key',
        lat: parseFloat(process.env.REACT_APP_CK_LAT) || 38.9078,
        lng: parseFloat(process.env.REACT_APP_CK_LONG) || -77.0320,
        type: 'venue',
        address: '1337 14th St NW, Washington, DC 20005'
    },
    {
        id: 'canopy-hilton',
        name: 'Canopy by Hilton Washington DC Embassy Row',
        lat: parseFloat(process.env.REACT_APP_CANOPY_LAT) || 38.9065,
        lng: parseFloat(process.env.REACT_APP_CANOPY_LONG) || -77.0375,
        type: 'hotel',
        address: '1600 Rhode Island Ave NW, Washington, DC 20036'
    },
    {
        id: 'courtyard-marriott',
        name: 'Courtyard Dupont Circle by Marriott',
        lat: parseFloat(process.env.REACT_APP_COURTYARD_LAT) || 38.9060,
        lng: parseFloat(process.env.REACT_APP_COURTYARD_LONG) || -77.0380,
        type: 'hotel',
        address: '1733 N St NW, Washington, DC 20036'
    }
];

const Activities = () => {
    const [locations, setLocations] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [startingLocation, setStartingLocation] = useState(null);

    // Backend API URL - defaults to localhost:8000 if not set
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    
    // Debug: Log predefined locations on mount
    React.useEffect(() => {
        console.log('Predefined Locations:', PREDEFINED_LOCATIONS);
        PREDEFINED_LOCATIONS.forEach(loc => {
            console.log(`${loc.name} (${loc.type}): lat=${loc.lat}, lng=${loc.lng}`);
        });
    }, []);

    const handleNewMessage = async (message) => {
        // Add user message immediately
        setChatMessages(prev => [...prev, message]);
        
        // Check for typed selection of starting location
        const messageLower = message.text.toLowerCase();
        const startKeywords = ['start from', 'start at', 'begin at', 'begin from', 'starting from', 'starting at'];
        
        for (const keyword of startKeywords) {
            if (messageLower.includes(keyword)) {
                // Try to match with predefined locations
                for (const location of PREDEFINED_LOCATIONS) {
                    if (messageLower.includes(location.name.toLowerCase())) {
                        setStartingLocation(location);
                        break;
                    }
                }
                break;
            }
        }
        
        // Extract locations using backend API
        setIsProcessing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/extract-locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.text
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Add AI response message if available
            if (data.response_text) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: data.response_text,
                    user: "AI Assistant",
                    timestamp: new Date()
                };
                setChatMessages(prev => [...prev, aiMessage]);
            }

            // Add new locations to the map
            if (data.locations && data.locations.length > 0) {
                data.locations.forEach(location => {
                    // Check if location already exists
                    if (!locations.find(loc => loc.name === location.name)) {
                        const newLocation = {
                            id: Date.now() + Math.random(),
                            name: location.name,
                            lat: location.lat,
                            lng: location.lng,
                            addedBy: message.user,
                            timestamp: new Date()
                        };
                        setLocations(prev => [...prev, newLocation]);
                    }
                });
            }
        } catch (error) {
            console.error('Error extracting locations:', error);
            // Add error message to chat
            const errorMessage = {
                id: Date.now() + 2,
                text: "Sorry, I couldn't process that request. Please try again.",
                user: "AI Assistant",
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="activities">
            <Navigation />
            <div className="activities-container">
                <div className="activities-header">
                    <p>Chat with our DC activities specialist! Ask about things to do, and we'll show you locations on the map.</p>
                </div>
                <div className="activities-content">
                    <div className="chat-section">
                        <Chat 
                            onNewMessage={handleNewMessage} 
                            messages={chatMessages} 
                            isProcessing={isProcessing}
                            predefinedLocations={PREDEFINED_LOCATIONS}
                            startingLocation={startingLocation}
                            onStartingLocationSelect={setStartingLocation}
                        />
                    </div>
                    <div className="map-section">
                        <Map 
                            locations={locations} 
                            predefinedLocations={PREDEFINED_LOCATIONS}
                            startingLocation={startingLocation}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;

