import React, { useState, useEffect, useCallback } from "react";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import { Button, Typography, Modal, Box, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, CircularProgress, Divider, MenuItem, Select, Grow } from "@mui/material";
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
    const [modalStep, setModalStep] = useState('search'); // 'search' | 'group' | 'success'
    const [rsvpFormData, setRsvpFormData] = useState({});
    const [formTouched, setFormTouched] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

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
                const formData = {};
                const allGuests = [data.primary, ...(data.accompanied || [])];
                allGuests.forEach((g) => {
                    formData[g.id] = {
                        wedding_accepted: g.wedding_accepted ?? 0,
                        welcome_drinks_accepted: g.welcome_drinks_accepted ?? 0,
                        allergies: (g.allergies || []).join(', '),
                    };
                });
                setRsvpFormData(formData);
                setFormTouched({});
                setModalStep('group');
            }
        } catch (err) {
            console.error("Failed to load guest group:", err);
        }
    }, []);

    const updateRsvpForm = useCallback((guestId, field, value) => {
        setRsvpFormData((prev) => ({
            ...prev,
            [guestId]: { ...prev[guestId], [field]: value },
        }));
        setFormTouched((prev) => ({
            ...prev,
            [`${guestId}_${field}`]: true,
        }));
    }, []);

    const handleRsvpSubmit = useCallback(async () => {
        if (!guestGroup) return;
        const incompleteGuests = [guestGroup.primary, ...(guestGroup.accompanied || [])].filter(
            (g) => !g.response_submitted
        );
        if (incompleteGuests.length === 0) return;
        setSubmitLoading(true);
        try {
            const payload = {
                guests: incompleteGuests.map((g) => ({
                    guest_id: g.id,
                    wedding_accepted: rsvpFormData[g.id]?.wedding_accepted ?? 0,
                    welcome_drinks_accepted: rsvpFormData[g.id]?.welcome_drinks_accepted ?? 0,
                    allergies: (rsvpFormData[g.id]?.allergies || '')
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                })),
            };
            const res = await fetch(`${API_URL}/api/guests/rsvp`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const groupRes = await fetch(`${API_URL}/api/guests/${guestGroup.primary.id}/group`);
                if (groupRes.ok) {
                    const data = await groupRes.json();
                    setGuestGroup(data);
                    const formData = {};
                    const allGuests = [data.primary, ...(data.accompanied || [])];
                    allGuests.forEach((g) => {
                        formData[g.id] = {
                            wedding_accepted: g.wedding_accepted ?? 0,
                            welcome_drinks_accepted: g.welcome_drinks_accepted ?? 0,
                            allergies: (g.allergies || []).join(', '),
                        };
                    });
                    setRsvpFormData(formData);
                }
                setModalStep('success');
            }
        } catch (err) {
            console.error("RSVP submit failed:", err);
        } finally {
            setSubmitLoading(false);
        }
    }, [guestGroup, rsvpFormData]);

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
                    maxWidth: 600,
                    maxHeight: '80vh',
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
                            <Box sx={{ overflowX: 'auto' }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', columnGap: 2, rowGap: 1.5, alignItems: 'center', minWidth: 420 }}>
                                    {/* Header row */}
                                    <Box />
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textAlign: 'center' }}>Wedding (6/13)</Typography>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textAlign: 'center' }}>Welcome Party (6/12)</Typography>
                                    {[guestGroup.primary, ...(guestGroup.accompanied || [])].some((g) => !g.response_submitted) ? (
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textAlign: 'center' }}>Food Constraints</Typography>
                                    ) : <Box />}

                                    {[guestGroup.primary, ...(guestGroup.accompanied || [])].map((guest) => (
                                        <React.Fragment key={guest.id}>
                                            <Typography variant="body2" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                                {guest.name}
                                            </Typography>
                                            {guest.response_submitted ? (
                                                <>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ textAlign: 'center', color: 'grey', fontStyle: 'italic' }}
                                                    >
                                                        Submitted
                                                    </Typography>
                                                    <Box />
                                                    <Box />
                                                </>
                                            ) : (
                                                <>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                        {formTouched[`${guest.id}_wedding_accepted`] ? (
                                                            <Grow in timeout={300}>
                                                                <Box>
                                                                    <Select
                                                                        variant="standard"
                                                                        size="small"
                                                                        value={rsvpFormData[guest.id]?.wedding_accepted ?? 0}
                                                                        onChange={(e) => updateRsvpForm(guest.id, 'wedding_accepted', e.target.value)}
                                                                        disableUnderline
                                                                        sx={{ fontSize: '0.75rem', '& .MuiSelect-icon': { fontSize: '1rem', color: (rsvpFormData[guest.id]?.wedding_accepted ?? 0) === 1 ? 'green' : 'red' } }}
                                                                        renderValue={(val) => (
                                                                            <Typography variant="caption" sx={{ color: val === 1 ? 'green' : 'red' }}>
                                                                                {val === 1 ? 'Accept' : 'Decline'}
                                                                            </Typography>
                                                                        )}
                                                                    >
                                                                        <MenuItem value={1} sx={{ fontSize: '0.75rem' }}>Accept</MenuItem>
                                                                        <MenuItem value={0} sx={{ fontSize: '0.75rem' }}>Decline</MenuItem>
                                                                    </Select>
                                                                </Box>
                                                            </Grow>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ cursor: 'pointer', '&:hover': { color: 'green' } }}
                                                                    onClick={() => updateRsvpForm(guest.id, 'wedding_accepted', 1)}
                                                                >
                                                                    Accept
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ cursor: 'pointer', '&:hover': { color: 'red' } }}
                                                                    onClick={() => updateRsvpForm(guest.id, 'wedding_accepted', 0)}
                                                                >
                                                                    Decline
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                        {formTouched[`${guest.id}_welcome_drinks_accepted`] ? (
                                                            <Grow in timeout={300}>
                                                                <Box>
                                                                    <Select
                                                                        variant="standard"
                                                                        size="small"
                                                                        value={rsvpFormData[guest.id]?.welcome_drinks_accepted ?? 0}
                                                                        onChange={(e) => updateRsvpForm(guest.id, 'welcome_drinks_accepted', e.target.value)}
                                                                        disableUnderline
                                                                        sx={{ fontSize: '0.75rem', '& .MuiSelect-icon': { fontSize: '1rem', color: (rsvpFormData[guest.id]?.welcome_drinks_accepted ?? 0) === 1 ? 'green' : 'red' } }}
                                                                        renderValue={(val) => (
                                                                            <Typography variant="caption" sx={{ color: val === 1 ? 'green' : 'red' }}>
                                                                                {val === 1 ? 'Accept' : 'Decline'}
                                                                            </Typography>
                                                                        )}
                                                                    >
                                                                        <MenuItem value={1} sx={{ fontSize: '0.75rem' }}>Accept</MenuItem>
                                                                        <MenuItem value={0} sx={{ fontSize: '0.75rem' }}>Decline</MenuItem>
                                                                    </Select>
                                                                </Box>
                                                            </Grow>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ cursor: 'pointer', '&:hover': { color: 'green' } }}
                                                                    onClick={() => updateRsvpForm(guest.id, 'welcome_drinks_accepted', 1)}
                                                                >
                                                                    Accept
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ cursor: 'pointer', '&:hover': { color: 'red' } }}
                                                                    onClick={() => updateRsvpForm(guest.id, 'welcome_drinks_accepted', 0)}
                                                                >
                                                                    Decline
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    <TextField
                                                        variant="standard"
                                                        placeholder="e.g. peanuts"
                                                        value={rsvpFormData[guest.id]?.allergies ?? ''}
                                                        onChange={(e) => updateRsvpForm(guest.id, 'allergies', e.target.value)}
                                                        size="small"
                                                        sx={{ minWidth: 0 }}
                                                        inputProps={{ style: { textAlign: 'center' } }}
                                                    />
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
                                <Button
                                    variant="text"
                                    onClick={() => setModalStep('search')}
                                    sx={{
                                        color: 'black',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        border: '1px solid transparent',
                                        borderRadius: 1,
                                        transition: 'border-color 0.3s ease',
                                        '&:hover': { backgroundColor: 'transparent', borderColor: 'black' },
                                    }}
                                >
                                    Back to search
                                </Button>
                                {[guestGroup.primary, ...(guestGroup.accompanied || [])].some((g) => !g.response_submitted) && (
                                    <Button
                                        variant="text"
                                        onClick={handleRsvpSubmit}
                                        disabled={submitLoading}
                                        sx={{
                                            color: 'black',
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            border: '1px solid transparent',
                                            borderRadius: 1,
                                            transition: 'border-color 0.3s ease',
                                            '&:hover': { backgroundColor: 'transparent', borderColor: 'black' },
                                        }}
                                    >
                                        {submitLoading ? 'Submitting...' : 'Submit RSVP'}
                                    </Button>
                                )}
                            </Box>
                        </div>
                    )}
                    {modalStep === 'success' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                border: '3px solid green',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'scaleIn 0.4s ease',
                                '@keyframes scaleIn': {
                                    '0%': { transform: 'scale(0)', opacity: 0 },
                                    '60%': { transform: 'scale(1.15)' },
                                    '100%': { transform: 'scale(1)', opacity: 1 },
                                },
                            }}>
                                <Box sx={{
                                    width: 36,
                                    height: 18,
                                    borderLeft: '3px solid green',
                                    borderBottom: '3px solid green',
                                    transform: 'rotate(-45deg) translate(2px, -4px)',
                                    animation: 'drawCheck 0.3s ease 0.3s both',
                                    '@keyframes drawCheck': {
                                        '0%': { width: 0, height: 0, opacity: 0 },
                                        '50%': { width: 36, height: 0, opacity: 1 },
                                        '100%': { width: 36, height: 18, opacity: 1 },
                                    },
                                }} />
                            </Box>
                            <Typography variant="h6" sx={{ mt: 3 }}>
                                RSVP Complete!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Thank you for your response.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                                <Button
                                    variant="text"
                                    onClick={() => setModalStep('group')}
                                    sx={{
                                        color: 'black',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        border: '1px solid transparent',
                                        borderRadius: 1,
                                        transition: 'border-color 0.3s ease',
                                        '&:hover': { backgroundColor: 'transparent', borderColor: 'black' },
                                    }}
                                >
                                    View your party
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={handleRSVPClose}
                                    sx={{
                                        color: 'black',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        border: '1px solid transparent',
                                        borderRadius: 1,
                                        transition: 'border-color 0.3s ease',
                                        '&:hover': { backgroundColor: 'transparent', borderColor: 'black' },
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Box>
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