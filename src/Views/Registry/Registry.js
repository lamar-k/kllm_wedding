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
    InputAdornment,
    CircularProgress,
    Alert
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Registry.css';
import { mockRegistryItems } from './registryConfig';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const apiUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': { color: '#aab7c4' },
            padding: '12px',
        },
        invalid: { color: '#9e2146' },
    },
};

const blackButtonSx = {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': { backgroundColor: '#333' },
};

function CheckoutForm({ amount, contributorName, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    console.log(stripePromise);
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setCardError(null);

        try {
            const res = await fetch(`${apiUrl}/api/payment/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount), contributor_name: contributorName }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed to create payment');
            }

            const { clientSecret } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (result.error) {
                setCardError(result.error.message);
                onError(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                onSuccess();
            }
        } catch (err) {
            setCardError(err.message);
            onError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mb: 1 }}>
                    Contributing <strong>${parseFloat(amount).toFixed(2)}</strong> as <strong>{contributorName}</strong>
                </Typography>
                <Box sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '14px',
                    '&:focus-within': { borderColor: '#000' },
                }}>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </Box>
                {cardError && <Alert severity="error">{cardError}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!stripe || processing}
                    sx={{ ...blackButtonSx, marginTop: '10px' }}
                >
                    {processing ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        `Pay $${parseFloat(amount).toFixed(2)}`
                    )}
                </Button>
            </Box>
        </form>
    );
}

const Registry = () => {
    const [honeymoonModalOpen, setHoneymoonModalOpen] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const [contributorName, setContributorName] = useState('');
    const [purchasedItems, setPurchasedItems] = useState(new Set());

    // Modal step: 'form' | 'payment' | 'success' | 'error'
    const [modalStep, setModalStep] = useState('form');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePurchaseItem = (itemId) => {
        setPurchasedItems(prev => new Set([...prev, itemId]));
        alert(`Thank you! ${mockRegistryItems.find(item => item.id === itemId)?.name} has been marked as purchased.`);
    };

    const handleContinueToPayment = () => {
        if (!contributionAmount || !contributorName) return;
        if (parseFloat(contributionAmount) <= 0) return;
        setModalStep('payment');
        console.log(stripePromise);
        console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    };

    const handlePaymentSuccess = () => {
        setModalStep('success');
    };

    const handlePaymentError = (message) => {
        setErrorMessage(message);
    };

    const handleHoneymoonModalOpen = () => {
        setModalStep('form');
        setContributionAmount('');
        setContributorName('');
        setErrorMessage('');
        setHoneymoonModalOpen(true);
    };

    const handleHoneymoonModalClose = () => {
        setHoneymoonModalOpen(false);
    };

    const renderModalContent = () => {
        if (modalStep === 'success') {
            return (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Thank You, {contributorName}!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Your contribution of ${parseFloat(contributionAmount).toFixed(2)} to our honeymoon fund has been received. We truly appreciate your generosity!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleHoneymoonModalClose}
                        sx={blackButtonSx}
                    >
                        Close
                    </Button>
                </Box>
            );
        }

        if (modalStep === 'payment') {
            return (
                <>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => { setModalStep('form'); setErrorMessage(''); }}
                        sx={{ mb: 2, color: '#666' }}
                        size="small"
                    >
                        Back
                    </Button>
                    <Typography variant="h6" component="h2" sx={{ mb: 3, textAlign: 'center' }}>
                        Payment Details
                    </Typography>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            amount={contributionAmount}
                            contributorName={contributorName}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </Elements>
                </>
            );
        }

        // Default: 'form' step
        return (
            <>
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
                            inputProps: { min: 1 },
                        }}
                        required
                    />
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleContinueToPayment}
                        disabled={!contributionAmount || !contributorName || parseFloat(contributionAmount) <= 0}
                        sx={{ ...blackButtonSx, marginTop: '10px' }}
                    >
                        Continue to Payment
                    </Button>
                </Box>
            </>
        );
    };

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
                        sx={blackButtonSx}
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
                    {renderModalContent()}
                </Box>
            </Modal>
        </div>
    );
};

export default Registry;
