import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import './Chat.css';

const Chat = ({ onNewMessage, messages }) => {
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
                            Start chatting about activities in D.C.!
                            <br />
                            <br />
                            Try mentioning places like:
                            <br />
                            "Washington Monument", "Lincoln Memorial", "National Mall",
                            <br />
                            "Georgetown", "Smithsonian", "White House", or "Capitol Hill"
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
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Share an activity or location..."
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
                            endIcon={<SendIcon />}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
};

export default Chat;

