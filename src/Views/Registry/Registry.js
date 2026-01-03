import React, { useState } from "react";
import Navigation from "../../Components/Navigation/Navigation";
import { 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    CardMedia, 
    Grid, 
    Box, 
    TextField,
    Modal,
    IconButton,
    InputAdornment
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Registry.css';
import { mockRegistryItems } from './registryConfig';

const Registry = () => {
    const [honeymoonModalOpen, setHoneymoonModalOpen] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const [contributorName, setContributorName] = useState('');
    const [purchasedItems, setPurchasedItems] = useState(new Set());

    const handlePurchaseItem = (itemId) => {
        setPurchasedItems(prev => new Set([...prev, itemId]));
        // In a real app, this would make an API call
        alert(`Thank you! ${mockRegistryItems.find(item => item.id === itemId)?.name} has been marked as purchased.`);
    };

    const handleHoneymoonContribution = () => {
        if (!contributionAmount || !contributorName) {
            alert('Please fill in all fields');
            return;
        }
        // In a real app, this would make an API call
        alert(`Thank you, ${contributorName}! Your contribution of $${contributionAmount} to our honeymoon fund has been recorded.`);
        setContributionAmount('');
        setContributorName('');
        setHoneymoonModalOpen(false);
    };

    const handleHoneymoonModalOpen = () => setHoneymoonModalOpen(true);
    const handleHoneymoonModalClose = () => setHoneymoonModalOpen(false);

    return (
        <div className="registry">
            <Navigation />
            
            <div className="registry-container">
                <Typography variant="h4" sx={{ marginTop: '40px', marginBottom: '20px', textAlign: 'center' }}>
                    Wedding Registry
                </Typography>
                
                <Typography variant="body1" sx={{ marginBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
                    We're so grateful for your love and support! Below are some items we'd love to have in our new home together. 
                    You can also contribute to our honeymoon fund if you prefer.
                </Typography>

                {/* Honeymoon Fund Section */}
                <Box 
                    sx={{ 
                        marginBottom: '60px',
                        padding: '30px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        margin: '0 auto 60px',
                        textAlign: 'center'
                    }}
                >
                    <FavoriteIcon sx={{ fontSize: 50, color: '#d32f2f', marginBottom: '10px' }} />
                    <Typography variant="h5" sx={{ marginBottom: '15px' }}>
                        Honeymoon Fund
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: '20px', color: '#666' }}>
                        Help us create unforgettable memories on our honeymoon! Any contribution is greatly appreciated.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleHoneymoonModalOpen}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#333'
                            }
                        }}
                    >
                        Contribute to Honeymoon Fund
                    </Button>
                </Box>

                {/* Registry Items Grid */}
                <Typography variant="h5" sx={{ marginBottom: '30px', textAlign: 'center' }}>
                    Registry Items
                </Typography>
                
                <Grid container spacing={4} sx={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', justifyContent: 'center' }}>
                    {mockRegistryItems.map((item) => {
                        const isPurchased = purchasedItems.has(item.id);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        opacity: isPurchased ? 0.6 : 1,
                                        position: 'relative'
                                    }}
                                >
                                    {isPurchased && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                zIndex: 1
                                            }}
                                        >
                                            <Typography variant="caption">Purchased</Typography>
                                        </Box>
                                    )}
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" component="h3" sx={{ marginBottom: '10px' }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '15px', flexGrow: 1 }}>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ marginBottom: '15px' }}>
                                            ${item.price.toFixed(2)}
                                        </Typography>
                                        <Button
                                            variant={isPurchased ? "outlined" : "contained"}
                                            fullWidth
                                            onClick={() => handlePurchaseItem(item.id)}
                                            disabled={isPurchased}
                                            sx={{
                                                backgroundColor: isPurchased ? 'transparent' : 'black',
                                                color: isPurchased ? 'black' : 'white',
                                                borderColor: 'black',
                                                '&:hover': {
                                                    backgroundColor: isPurchased ? 'transparent' : '#333',
                                                    borderColor: 'black'
                                                }
                                            }}
                                        >
                                            {isPurchased ? 'Already Purchased' : 'Mark as Purchased'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>

            {/* Honeymoon Fund Modal */}
            <Modal
                open={honeymoonModalOpen}
                onClose={handleHoneymoonModalClose}
                aria-labelledby="honeymoon-modal-title"
                aria-describedby="honeymoon-modal-description"
                style={{ backdropFilter: "blur(5px)" }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 500 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'right', marginBottom: '10px' }}>
                        <IconButton onClick={handleHoneymoonModalClose} sx={{ '&:hover': { cursor: 'pointer' } }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Typography id="honeymoon-modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px', textAlign: 'center' }}>
                        Contribute to Our Honeymoon Fund
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Your Name"
                            variant="outlined"
                            fullWidth
                            value={contributorName}
                            onChange={(e) => setContributorName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Contribution Amount"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleHoneymoonContribution}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                marginTop: '10px',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Submit Contribution
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default Registry;

