import React, {useState, useEffect} from "react";
import './Home.css';
import '../../Components/Countdown/Countdown.js';
import Countdown from "../../Components/Countdown/Countdown.js";
import Navigation from '../../Components/Navigation/Navigation.js';
import {Button, Typography, Modal, Box, TextField, IconButton, InputAdornment} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';


function Home() {
    const [rsvpOpen, setRsvpOpen] = useState(false);
    const handleRSVPOpen = () => setRsvpOpen(true);
    const handleRSVPClose = () => setRsvpOpen(false);

    const [modalHeight, setModalHeight] = useState(window.innerHeight * 0.2);
    const [modalWidth, setModalWidth] = useState(window.innerWidth * 0.2);
    
    const [heroImage, setHeroImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                setImageLoading(true);
                
                const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
                const tokenResponse = await fetch(`${apiUrl}/api/gallery/sas-token`);
                
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
                    width: modalWidth,
                    height: modalHeight,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <div style={{flex:1, justifyContent:'right', textAlign:'right'}}>
                        <CloseIcon onClick={handleRSVPClose} sx={{'&:hover': {cursor:'pointer'}}}/>
                    </div>
                    <div style={{flex:1, justifyContent:'center', textAlign:'center', marginTop:'25px'}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        RSVP by searching your full name:
                    </Typography>
                    <TextField label="Search Full Name"
            variant="outlined"
            // value={searchTerm}
            // onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            style={{marginTop:'25px'}}/>
                    </div>
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