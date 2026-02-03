import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Chip } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ClearIcon from '@mui/icons-material/Clear';
import './Chat.css';

const Chat = ({ onNewMessage, messages, isProcessing = false, predefinedLocations = [], startingLocation = null, onStartingLocationSelect = () => {} }) => {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            const newMessage = {
                id: Date.now(),
                text: inputValue,
                user: "You", // In a real app, this would be the actual user
                timestamp: new Date()
            };
            onNewMessage(newMessage);
            setInputValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLocationSelect = (location) => {
        // Toggle selection: if clicking the same location, clear it
        if (startingLocation && startingLocation.id === location.id) {
            onStartingLocationSelect(null);
        } else {
            onStartingLocationSelect(location);
        }
    };

    return (
        <div className="chat-container">
            <Paper 
                elevation={2} 
                sx={{ 
                    height: '500px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    backgroundColor: '#fafafa'
                }}
            >
                <Box 
                    sx={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    {messages.length === 0 ? (
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ textAlign: 'center', marginTop: '20px' }}
                        >
                            Ask me anything about activities and things to do in Washington D.C.!
                            <br />
                            <br />
                            I'm your DC activities specialist. Try asking:
                            <br />
                            "What museums should I visit?", "What are the best monuments to see?",
                            <br />
                            "Where can I go shopping?", "What's good for dinner?",
                            <br />
                            "What activities are available?", or "Tell me about DC's neighborhoods"
                        </Typography>
                    ) : (
                        messages.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: message.user === 'You' ? 'flex-end' : 'flex-start',
                                    marginBottom: '8px'
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '70%',
                                        backgroundColor: message.user === 'You' ? '#1976d2' : '#e0e0e0',
                                        color: message.user === 'You' ? 'white' : 'black',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        {message.user}
                                    </Typography>
                                    <Typography variant="body1">
                                        {message.text}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            display: 'block', 
                                            marginTop: '4px',
                                            opacity: 0.7
                                        }}
                                    >
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </Box>
                
                {/* Starting Location Selection */}
                {predefinedLocations.length > 0 && (
                    <Box sx={{ p: 2, pt: 1, borderTop: '1px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="caption" sx={{ color: 'black', fontWeight: 'bold', mb: 1, display: 'block' }}>
                            Select Starting Location:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {predefinedLocations.map((location) => {
                                const isSelected = startingLocation && startingLocation.id === location.id;
                                const isVenue = location.type === 'venue';
                                
                                return (
                                    <Chip
                                        key={location.id}
                                        icon={isVenue ? <RestaurantIcon /> : <HotelIcon />}
                                        label={location.name}
                                        onClick={() => handleLocationSelect(location)}
                                        onDelete={isSelected ? () => onStartingLocationSelect(null) : undefined}
                                        deleteIcon={isSelected ? <ClearIcon /> : undefined}
                                        variant={isSelected ? "filled" : "outlined"}
                                        color={isSelected ? "warning" : "default"}
                                        sx={{
                                            borderColor: isSelected ? '#fbc02d' : 'black',
                                            color: isSelected ? 'white' : 'black',
                                            backgroundColor: isSelected ? '#fbc02d' : 'white',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: isSelected ? '#f9a825' : '#f5f5f5',
                                                borderColor: isSelected ? '#f9a825' : '#333'
                                            },
                                            '& .MuiChip-icon': {
                                                color: isSelected ? 'white' : 'black'
                                            },
                                            '& .MuiChip-deleteIcon': {
                                                color: isSelected ? 'white' : 'black',
                                                '&:hover': {
                                                    color: isSelected ? '#f5f5f5' : '#666'
                                                }
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                )}
                
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Ask me about activities and things to do in D.C...."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={isProcessing}
                            endIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#333'
                                },
                                '&:disabled': {
                                    backgroundColor: '#666'
                                }
                            }}
                        >
                            {isProcessing ? 'Processing...' : 'Send'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
};

export default Chat;

