import React from "react";
import Navigation from "../../Components/Navigation/Navigation";
import { Typography, Button, Card, CardContent, Grid, Box } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Registry.css';

// TODO: Replace with actual registry URLs when provided
const CRATE_AND_BARREL_REGISTRY_URL = process.env.REACT_APP_CRATE_AND_BARREL_REGISTRY_URL || 'https://www.crateandbarrel.com/gift-registry/lauren-mcallister-and-ken-lamar/r7380081';
const AMAZON_REGISTRY_URL = process.env.REACT_APP_AMAZON_REGISTRY_URL || 'https://www.amazon.com/wedding/share/KenandLauren';
const PAYPAL_ME_URL = process.env.REACT_APP_PAYPAL_ME_URL || '';
const VENMO_URL = process.env.REACT_APP_VENMO_URL || '';

const blackButtonSx = {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': { backgroundColor: '#333' },
};

const paypalButtonSx = {
    backgroundColor: '#FFC439',
    color: '#003087',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#F0B72A' },
};

const venmoButtonSx = {
    backgroundColor: '#008CFF',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#0074D4' },
};

const Registry = () => {
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
                                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                                    <Button
                                        variant="contained"
                                        href={PAYPAL_ME_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ ...paypalButtonSx, flex: 1, minWidth: 0 }}
                                    >
                                        PayPal
                                    </Button>
                                    <Button
                                        variant="contained"
                                        href={VENMO_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ ...venmoButtonSx, flex: 1, minWidth: 0 }}
                                    >
                                        Venmo
                                    </Button>
                                </Box>
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
        </div>
    );
};

export default Registry;
