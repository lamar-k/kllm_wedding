import React, { useState } from "react";
import Navigation from "../../Components/Navigation/Navigation";
import { 
    Typography, 
    Button, 
    Card, 
    CardContent, 
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
import HomeIcon from '@mui/icons-material/Home';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Registry.css';

// TODO: Replace with actual registry URLs when provided
const CRATE_AND_BARREL_REGISTRY_URL = process.env.REACT_APP_CRATE_AND_BARREL_REGISTRY_URL || 'https://www.crateandbarrel.com/gift-registry/lauren-mcallister-and-ken-lamar/r7380081';
const AMAZON_REGISTRY_URL = process.env.REACT_APP_AMAZON_REGISTRY_URL || 'https://www.amazon.com/wedding/share/KenandLauren';

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
    const [houseModalOpen, setHouseModalOpen] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const [contributorName, setContributorName] = useState('');

    // Modal step: 'form' | 'payment' | 'success' | 'error'
    const [modalStep, setModalStep] = useState('form');
    const [errorMessage, setErrorMessage] = useState('');

    const handleContinueToPayment = () => {
        if (!contributionAmount || !contributorName) return;
        if (parseFloat(contributionAmount) <= 0) return;
        setModalStep('payment');
    };

    const handlePaymentSuccess = () => {
        setModalStep('success');
    };

    const handlePaymentError = (message) => {
        setErrorMessage(message);
    };

    const handleHouseModalOpen = () => {
        setModalStep('form');
        setContributionAmount('');
        setContributorName('');
        setErrorMessage('');
        setHouseModalOpen(true);
    };

    const handleHouseModalClose = () => {
        setHouseModalOpen(false);
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
                        Your contribution of ${parseFloat(contributionAmount).toFixed(2)} to our house fund has been received. We truly appreciate your generosity!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleHouseModalClose}
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
                <Typography id="house-modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    Contribute to Our House Fund
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
                    We're so grateful for your love and support! Browse our registries below or contribute to our house fund.
                </Typography>

                <Grid container spacing={4} sx={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', justifyContent: 'center' }}>
                    {/* House Fund */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 3 }}>
                            <HomeIcon sx={{ fontSize: 50, color: '#1976d2', marginBottom: 1, mx: 'auto' }} />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ marginBottom: 1 }}>
                                    House Fund
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 2, color: '#666', flexGrow: 1 }}>
                                    Help us build our dream home! Any contribution is greatly appreciated.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled
                                    onClick={(e) => e.preventDefault()}
                                    sx={{ ...blackButtonSx, pointerEvents: 'none' }}
                                >
                                    Contribute
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Crate & Barrel */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 3 }}>
                            <CardGiftcardIcon sx={{ fontSize: 50, color: '#1976d2', marginBottom: 1, mx: 'auto' }} />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ marginBottom: 1 }}>
                                    Crate & Barrel
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 2, color: '#666', flexGrow: 1 }}>
                                    Browse our Crate & Barrel registry for home goods we'd love.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    href={CRATE_AND_BARREL_REGISTRY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={blackButtonSx}
                                >
                                    View Registry
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Amazon */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 3 }}>
                            <ShoppingCartIcon sx={{ fontSize: 50, color: '#1976d2', marginBottom: 1, mx: 'auto' }} />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h5" sx={{ marginBottom: 1 }}>
                                    Amazon
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 2, color: '#666', flexGrow: 1 }}>
                                    Find items from our Amazon wedding registry.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    href={AMAZON_REGISTRY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={blackButtonSx}
                                >
                                    View Registry
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>

            {/* House Fund Modal */}
            <Modal
                open={houseModalOpen}
                onClose={handleHouseModalClose}
                aria-labelledby="house-modal-title"
                aria-describedby="house-modal-description"
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
                        <IconButton onClick={handleHouseModalClose} sx={{ '&:hover': { cursor: 'pointer' } }}>
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
