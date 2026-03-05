import React, { useState, useEffect, useCallback } from "react";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import { Button, Typography, Modal, Box, TextField, InputAdornment, List, ListItemButton, ListItemText, CircularProgress, Grow } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import seasideImg from '../../images/seaside.jpg';

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

const STATUS_ACCEPTED = 'accepted';
const STATUS_DECLINED = 'declined';
const STEP_LABELS = ['Wedding — June 13', 'Welcome Party — June 12', 'Dietary restrictions (optional)'];

const isRsvpComplete = (guest) =>
    guest.response_submitted &&
    guest.wedding_accepted_status &&
    guest.welcome_drinks_accepted_status;

function Home() {
    const [rsvpOpen, setRsvpOpen] = useState(false);
    const handleRSVPOpen = () => {
        setRsvpOpen(true);
        setModalStep('search');
        setSearchTerm('');
        setSearchResults([]);
        setGuestGroup(null);
        setRsvpStep(0);
        setIsEditing(false);
    };
    const handleRSVPClose = () => setRsvpOpen(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [guestGroup, setGuestGroup] = useState(null);
    const [modalStep, setModalStep] = useState('search'); // 'search' | 'group' | 'success'
    const [rsvpFormData, setRsvpFormData] = useState({});
    const [rsvpStep, setRsvpStep] = useState(0); // 0=wedding, 1=welcome, 2=allergies
    const [isEditing, setIsEditing] = useState(false);
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
                        wedding_accepted_status: g.wedding_accepted_status ?? null,
                        welcome_drinks_accepted_status: g.welcome_drinks_accepted_status ?? null,
                        allergies: (g.allergies || []).join(', '),
                    };
                });
                setRsvpFormData(formData);
                setRsvpStep(0);
                setIsEditing(false);
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
    }, []);

    const updateRsvpStatus = useCallback((guestId, fieldPrefix, status) => {
        const statusField = `${fieldPrefix}_accepted_status`;
        const intField = `${fieldPrefix}_accepted`;
        setRsvpFormData((prev) => ({
            ...prev,
            [guestId]: { ...prev[guestId], [statusField]: status, [intField]: 1 },
        }));
    }, []);

    const handleRsvpSubmit = useCallback(async () => {
        if (!guestGroup) return;
        const allGuests = [guestGroup.primary, ...(guestGroup.accompanied || [])];
        const incompleteGuests = allGuests.filter((g) => !isRsvpComplete(g));
        const guestsToSubmit = isEditing ? allGuests : incompleteGuests;
        if (guestsToSubmit.length === 0) return;
        setSubmitLoading(true);
        try {
            const payload = {
                guests: guestsToSubmit.map((g) => {
                    const fd = rsvpFormData[g.id] || {};
                    const weddingStatus = fd.wedding_accepted_status ?? null;
                    const welcomeStatus = fd.welcome_drinks_accepted_status ?? null;
                    return {
                        guest_id: g.id,
                        wedding_accepted: weddingStatus != null ? 1 : 0,
                        welcome_drinks_accepted: welcomeStatus != null ? 1 : 0,
                        wedding_accepted_status: weddingStatus,
                        welcome_drinks_accepted_status: welcomeStatus,
                        allergies: (fd.allergies || '')
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                    };
                }),
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
                    const refreshedGuests = [data.primary, ...(data.accompanied || [])];
                    refreshedGuests.forEach((g) => {
                        formData[g.id] = {
                            wedding_accepted: g.wedding_accepted ?? 0,
                            welcome_drinks_accepted: g.welcome_drinks_accepted ?? 0,
                            wedding_accepted_status: g.wedding_accepted_status ?? null,
                            welcome_drinks_accepted_status: g.welcome_drinks_accepted_status ?? null,
                            allergies: (g.allergies || []).join(', '),
                        };
                    });
                    setRsvpFormData(formData);
                }
                setModalStep('success');
                if (isEditing) setIsEditing(false);
            }
        } catch (err) {
            console.error("RSVP submit failed:", err);
        } finally {
            setSubmitLoading(false);
        }
    }, [guestGroup, rsvpFormData, isEditing]);

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
            <Navigation/>
            <img src={seasideImg} alt="Seaside" className="hero-banner" />
            <div className="wedding-details">
                <p className="wedding-date">June 13, 2026</p>
                <p className="wedding-location">Washington, D.C.</p>
            </div>
            <Countdown/>

            <div>
            <Button variant="outlined" onClick={handleRSVPOpen} sx={{color:'black', 
                    transition: 'box-shadow 0.3s ease-in-out', borderColor:'black', marginBottom: '20px'
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
                                                sx={{ color: isRsvpComplete(guest) ? 'green' : 'red', whiteSpace: 'nowrap', ml: 2 }}
                                            >
                                                {isRsvpComplete(guest) ? "RSVP Complete" : "RSVP Incomplete"}
                                            </Typography>
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </div>
                    )}
                    {modalStep === 'group' && guestGroup && (() => {
                        const allGuests = [guestGroup.primary, ...(guestGroup.accompanied || [])];
                        const incompleteGuests = allGuests.filter((g) => !isRsvpComplete(g));
                        const allComplete = incompleteGuests.length === 0;

                        const getGuestStatus = (guest, fieldPrefix) => {
                            const status = fieldPrefix === 'wedding'
                                ? guest.wedding_accepted_status
                                : guest.welcome_drinks_accepted_status;
                            if (!status) return 'No response';
                            return status === STATUS_ACCEPTED ? 'Attending' : 'Respectfully declined';
                        };

                        if (allComplete && !isEditing) {
                            return (
                                <div style={{ flex: 1, marginTop: '25px' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                                        Your party
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                                        {allGuests.map((guest) => (
                                            <Box
                                                key={guest.id}
                                                sx={{
                                                    p: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                                                    {guest.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Wedding: {getGuestStatus(guest, 'wedding')} · Welcome Party: {getGuestStatus(guest, 'welcome_drinks')}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4, flexWrap: 'wrap' }}>
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
                                        <Button
                                            variant="outlined"
                                            onClick={() => { setIsEditing(true); setRsvpStep(0); }}
                                            sx={{
                                                color: 'black',
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                borderColor: 'black',
                                                '&:hover': { borderColor: 'black', backgroundColor: 'rgba(0,0,0,0.04)' },
                                            }}
                                        >
                                            Edit
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
                                </div>
                            );
                        }

                        const guestsToEdit = isEditing ? allGuests : incompleteGuests;
                        return (
                            <div style={{ flex: 1, marginTop: '25px' }}>
                                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
                                    Step {rsvpStep + 1} of 3
                                </Typography>
                                <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
                                    {STEP_LABELS[rsvpStep]}
                                </Typography>
                                <Grow in key={rsvpStep} timeout={200}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {rsvpStep < 2 ? (
                                            guestsToEdit.map((guest) => {
                                                const fieldPrefix = rsvpStep === 0 ? 'wedding' : 'welcome_drinks';
                                                const status = rsvpFormData[guest.id]?.[`${fieldPrefix}_accepted_status`] ?? null;
                                                const attendingSelected = status === STATUS_ACCEPTED;
                                                const declineSelected = status === STATUS_DECLINED;
                                                return (
                                                    <Box
                                                        key={guest.id}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            p: 2,
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {guest.name}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => updateRsvpStatus(guest.id, fieldPrefix, STATUS_ACCEPTED)}
                                                                sx={{
                                                                    borderRadius: '9999px',
                                                                    textTransform: 'none',
                                                                    ...(attendingSelected ? { borderColor: 'success.main', color: 'success.main', borderWidth: 2, '&:hover': { borderWidth: 2, borderColor: 'success.dark', backgroundColor: 'rgba(46, 125, 50, 0.08)' } } : {}),
                                                                }}
                                                            >
                                                                Will Attend
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => updateRsvpStatus(guest.id, fieldPrefix, STATUS_DECLINED)}
                                                                sx={{
                                                                    borderRadius: '9999px',
                                                                    textTransform: 'none',
                                                                    ...(declineSelected ? { borderColor: 'error.main', color: 'error.main', borderWidth: 2, '&:hover': { borderWidth: 2, borderColor: 'error.dark', backgroundColor: 'rgba(211, 47, 47, 0.08)' } } : {}),
                                                                }}
                                                            >
                                                                Respectfully Decline
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                );
                                            })
                                        ) : (
                                            guestsToEdit.map((guest) => (
                                                <Box
                                                    key={guest.id}
                                                    sx={{
                                                        p: 2,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                                                        {guest.name}
                                                    </Typography>
                                                    <TextField
                                                        variant="standard"
                                                        placeholder="e.g. peanuts, shellfish"
                                                        value={rsvpFormData[guest.id]?.allergies ?? ''}
                                                        onChange={(e) => updateRsvpForm(guest.id, 'allergies', e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Box>
                                            ))
                                        )}
                                    </Box>
                                </Grow>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, px: 1 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => {
                                            if (rsvpStep === 0) {
                                                if (isEditing) { setIsEditing(false); } else { setModalStep('search'); }
                                            } else {
                                                setRsvpStep((s) => s - 1);
                                            }
                                        }}
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
                                        {rsvpStep === 0 ? (isEditing ? 'Cancel' : 'Back to search') : 'Back'}
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={rsvpStep === 2 ? handleRsvpSubmit : () => setRsvpStep((s) => s + 1)}
                                        disabled={rsvpStep === 2 && submitLoading}
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
                                        {rsvpStep === 2 ? (submitLoading ? 'Submitting...' : 'Submit RSVP') : 'Next'}
                                    </Button>
                                </Box>
                            </div>
                        );
                    })()}
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


        </div>
    );
    }
export default Home;