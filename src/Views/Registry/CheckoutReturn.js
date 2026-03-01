import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "../../Components/Navigation/Navigation";
import { Typography, Box, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const API_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const CheckoutReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const [customerName, setCustomerName] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/registry/session-status?session_id=${sessionId}`
                );
                if (!res.ok) throw new Error("Failed to get session status");
                const data = await res.json();

                if (data.payment_status === "paid") {
                    setStatus("success");
                    setCustomerName(data.customer_name);
                } else {
                    setStatus("pending");
                }
            } catch {
                setStatus("error");
            }
        };

        checkStatus();
    }, [searchParams]);

    useEffect(() => {
        if (status === "success" || status === "error") {
            const timer = setTimeout(() => navigate("/registry"), 5000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    return (
        <div style={{ minHeight: "100vh" }}>
            <Navigation />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    textAlign: "center",
                    padding: "20px",
                }}
            >
                {status === "loading" && (
                    <>
                        <CircularProgress sx={{ mb: 3 }} />
                        <Typography variant="h6">
                            Confirming your payment...
                        </Typography>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircleOutlineIcon
                            sx={{ fontSize: 80, color: "#4caf50", mb: 2 }}
                        />
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Thank you{customerName ? `, ${customerName}` : ""}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Your contribution to our house fund has been
                            received. We truly appreciate your generosity!
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 3 }}
                        >
                            Redirecting back to the registry...
                        </Typography>
                    </>
                )}

                {status === "pending" && (
                    <>
                        <CircularProgress sx={{ mb: 3 }} />
                        <Typography variant="h6">
                            Your payment is being processed...
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            This may take a moment.
                        </Typography>
                    </>
                )}

                {status === "error" && (
                    <>
                        <ErrorOutlineIcon
                            sx={{ fontSize: 80, color: "#f44336", mb: 2 }}
                        />
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            We couldn't confirm your payment. Please check your
                            email for a receipt or try again.
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 3 }}
                        >
                            Redirecting back to the registry...
                        </Typography>
                    </>
                )}
            </Box>
        </div>
    );
};

export default CheckoutReturn;
