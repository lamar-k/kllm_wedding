import React, { useState, useEffect, useCallback } from "react";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import { Button, Typography, Modal, Box, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

function Home() {
    const [rsvpOpen, setRsvpOpen] = useState(false);
    const handleRSVPOpen = () => {
        setRsvpOpen(true);
        setModalStep('search');
        setSearchTerm('');
        setSearchResults([]);
        setGuestGroup(null);
    };
    const handleRSVPClose = () => setRsvpOpen(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [guestGroup, setGuestGroup] = useState(null);
    const [modalStep, setModalStep] = useState('search'); // 'search' | 'group'

    const [heroImage, setHeroImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    // Debounced guest search
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < MIN_SEARCH_LENGTH) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/api/guests/search?name=${encodeURIComponent(searchTerm.trim())}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                } else {
                    setSearchResults([]);
                }
            } catch (err) {
                console.error("Guest search failed:", err);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelectGuest = useCallback(async (guestId) => {
        try {
            const res = await fetch(`${API_URL}/api/guests/${guestId}/group`);
            if (res.ok) {
                const data = await res.json();
                setGuestGroup(data);
                setModalStep('group');
            }
        } catch (err) {
            console.error("Failed to load guest group:", err);
        }
    }, []);

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                setImageLoading(true);
                const tokenResponse = await fetch(`${API_URL}/api/gallery/sas-token`);
                if (tokenResponse.ok) {
                    const { containerUrl, sasToken } = await tokenResponse.json();
                    const imageUrl = `${containerUrl}/Tezza-8936.JPG?${sasToken}`;
                    setHeroImage(imageUrl);
                }
            } catch (err) {
                console.error("Failed to load hero image:", err);
            } finally {
                setImageLoading(false);
            }
        };
        fetchHeroImage();
    }, []);

    return (
        <div className="home">
            <div className="header-text">
               <h2 style={{color:'black'}} className="script_text">Lauren + Ken</h2>
               <h3 style={{color:'black'}} className="script_subtext">June 13, 2026 &emsp; | &emsp; Washington, D.C.</h3>
            </div>
            <Countdown/>

            <div>
            <Button variant="outlined" onClick={handleRSVPOpen} sx={{color:'black', 
                    transition: 'box-shadow 0.3s ease-in-out', borderColor:'black'
                    , '&:hover': {color:'white', borderColor:'white', backgroundColor:'black'}}}>
                        RSVP HERE
                    </Button>
            </div>

            <Modal
                open={rsvpOpen}
                onClose={handleRSVPClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ backdropFilter: "blur(5px)" }}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90vw',
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflow: 'auto',
                }}>
                    <div style={{ flex: 1, justifyContent: 'right', textAlign: 'right' }}>
                        <CloseIcon onClick={handleRSVPClose} sx={{ '&:hover': { cursor: 'pointer' } }} />
                    </div>
                    {modalStep === 'search' && (
                        <div style={{ flex: 1, marginTop: '25px' }}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                                RSVP by searching your full name:
                            </Typography>
                            <TextField
                                label="Search Full Name"
                                variant="standard"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                fullWidth
                                autoFocus
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {searchLoading ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <SearchIcon sx={{ color: 'action.disabled' }} />
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                                style={{ marginTop: '25px' }}
                            />
                            {searchTerm.trim().length >= MIN_SEARCH_LENGTH && (
                                <List dense sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                                    {searchResults.length === 0 && !searchLoading && (
                                        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
                                            No guests found
                                        </Typography>
                                    )}
                                    {searchResults.map((guest) => (
                                        <ListItemButton
                                            key={guest.id}
                                            onClick={() => handleSelectGuest(guest.id)}
                                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <ListItemText primary={guest.name} sx={{ flex: '0 1 auto' }} />
                                            <Typography
                                                variant="body2"
                                                sx={{ color: guest.response_submitted ? 'green' : 'red', whiteSpace: 'nowrap', ml: 2 }}
                                            >
                                                {guest.response_submitted ? "RSVP Complete" : "RSVP Incomplete"}
                                            </Typography>
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </div>
                    )}
                    {modalStep === 'group' && guestGroup && (
                        <div style={{ flex: 1, marginTop: '25px' }}>
                            <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                                Your party
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary={guestGroup.primary.name}
                                        secondary={guestGroup.primary.response_submitted ? "RSVP Complete" : "RSVP Incomplete"}
                                        secondaryTypographyProps={{ sx: { color: guestGroup.primary.response_submitted ? 'green' : 'red' } }}
                                    />
                                </ListItem>
                                {guestGroup.accompanied.map((g) => (
                                    <ListItem key={g.id}>
                                        <ListItemText
                                            primary={g.name}
                                            secondary={g.response_submitted ? "RSVP Complete" : "RSVP Incomplete"}
                                            secondaryTypographyProps={{ sx: { color: g.response_submitted ? 'green' : 'red' } }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="outlined"
                                onClick={() => setModalStep('search')}
                                sx={{ mt: 2, display: 'block', mx: 'auto' }}
                            >
                                Back to search
                            </Button>
                        </div>
                    )}
                </Box>
            </Modal>

            <Navigation/>

            <div style={{display:'flex', justifyContent:'center',  marginTop:'20px'}}>
                {imageLoading ? (
                    <div style={{height: '70vh', display: 'flex', alignItems: 'center', fontSize: '16px', color: '#666'}}>
                        Loading...
                    </div>
                ) : heroImage ? (
                    <img src={heroImage} alt="LK Wedding Photo" className="LK"
                        style={{display:'flex', width:'90%', maxHeight:'70vh', objectFit:'contain', marginBottom:'10px', marginTop:'10px'}} 
                    />
                ) : (
                    <div style={{height: '70vh', display: 'flex', alignItems: 'center', fontSize: '16px', color: '#666'}}>
                        Image unavailable
                    </div>
                )}
            </div>

        </div>
    );
    }
export default Home;