import React, { useState } from "react";
import Navigation from "../../Components/Navigation/Navigation";
import Chat from "./Chat";
import Map from "./Map";
import './Activities.css';

const Activities = () => {
    const [locations, setLocations] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Backend API URL - defaults to localhost:8000 if not set
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    const handleNewMessage = async (message) => {
        // Add user message immediately
        setChatMessages(prev => [...prev, message]);
        
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
                        <Chat onNewMessage={handleNewMessage} messages={chatMessages} isProcessing={isProcessing} />
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

