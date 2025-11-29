import React, { useEffect, useRef, useCallback } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import './Map.css';

const Map = ({ locations }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const dataSourceRef = useRef(null);
    const isMapReadyRef = useRef(false);

    const updateMarkers = useCallback((map, dataSource, locs) => {
        dataSource.clear();

        if (locs.length === 0) {
            map.setCamera({
                center: [-77.0369, 38.9072],
                zoom: 12
            });
            return;
        }

        locs.forEach((location) => {
            const point = new atlas.Shape(
                new atlas.data.Point([location.lng, location.lat]),
                location.id.toString(),
                {
                    title: location.name,
                    description: `Added by ${location.addedBy}`
                }
            );
            dataSource.add([point]);
        });

        const existingLayer = map.layers.getLayers().find(layer => layer instanceof atlas.layer.SymbolLayer);
        if (existingLayer) {
            map.layers.remove(existingLayer);
        }

        const symbolLayer = new atlas.layer.SymbolLayer(dataSource, null, {
            textOptions: {
                textField: ['get', 'title'],
                offset: [0, -2],
                color: 'black',
                haloColor: 'white',
                haloWidth: 2
            },
            iconOptions: {
                image: 'pin-round-blue',
                anchor: 'center'
            }
        });
        map.layers.add(symbolLayer);

        if (locs.length > 0) {
            if (locs.length === 1) {
                map.setCamera({
                    center: [locs[0].lng, locs[0].lat],
                    zoom: 14
                });
            } else {
                const lngs = locs.map(loc => loc.lng);
                const lats = locs.map(loc => loc.lat);
                const minLng = Math.min(...lngs);
                const maxLng = Math.max(...lngs);
                const minLat = Math.min(...lats);
                const maxLat = Math.max(...lats);
                
                const bounds = new atlas.data.BoundingBox(
                    [minLng, minLat],
                    [maxLng, maxLat]
                );
                
                map.setCamera({
                    bounds: bounds,
                    padding: 50
                });
            }
        }
    }, []);
    useEffect(() => {
        const subscriptionKey = process.env.REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY;
        
        if (!subscriptionKey || !mapRef.current || mapInstanceRef.current) {
            return;
        }

        const map = new atlas.Map(mapRef.current, {
            authOptions: {
                authType: 'subscriptionKey',
                subscriptionKey: subscriptionKey
            },
            center: [-77.0369, 38.9072], // Washington D.C. center
            zoom: 12,
            style: 'road_shaded_relief',
            language: 'en-US'
        });

        mapInstanceRef.current = map;

        map.events.add('ready', () => {
            isMapReadyRef.current = true;
            const dataSource = new atlas.source.DataSource();
            map.sources.add(dataSource);
            dataSourceRef.current = dataSource;


            if (locations.length > 0) {
                updateMarkers(map, dataSource, locations);
            }
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.dispose();
                mapInstanceRef.current = null;
                dataSourceRef.current = null;
                isMapReadyRef.current = false;
            }
        };
    }, [updateMarkers]); 
    useEffect(() => {
        if (!isMapReadyRef.current || !mapInstanceRef.current || !dataSourceRef.current) {
            return;
        }

        updateMarkers(mapInstanceRef.current, dataSourceRef.current, locations);
    }, [locations, updateMarkers]);

    return (
        <div className="map-container">
            <Paper elevation={2} sx={{ height: '500px', overflow: 'hidden' }}>
                {process.env.REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY ? (
                    <div 
                        ref={mapRef} 
                        style={{ 
                            width: '100%', 
                            height: '100%' 
                        }}
                    />
                ) : (
                    <Box 
                        sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexDirection: 'column',
                            p: 2
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            Azure Maps subscription key not configured.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Add REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY to your .env file
                        </Typography>
                    </Box>
                )}
            </Paper>
            {locations.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: 'black' }}>
                        Locations mentioned:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {locations.map((location) => (
                            <Chip
                                key={location.id}
                                icon={<LocationOnIcon />}
                                label={location.name}
                                variant="outlined"
                                sx={{
                                    borderColor: 'black',
                                    color: 'black',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default Map;

