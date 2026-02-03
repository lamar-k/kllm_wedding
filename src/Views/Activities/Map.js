import React, { useEffect, useRef, useCallback, useState } from "react";
import { Box, Typography, Paper, Chip, CircularProgress } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import './Map.css';

const Map = ({ locations, predefinedLocations = [], startingLocation = null }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const dataSourceRef = useRef(null);
    const predefinedDataSourceRef = useRef(null);
    const drivingRouteDataSourceRef = useRef(null);
    const walkingRouteDataSourceRef = useRef(null);
    const isMapReadyRef = useRef(false);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loadingRoutes, setLoadingRoutes] = useState(false);

    const updateMarkers = useCallback((map, dataSource, predefinedDataSource, locs, predefinedLocs, startingLoc) => {
        // Clear existing markers
        dataSource.clear();
        predefinedDataSource.clear();

        // Add predefined locations (venues and hotels)
        predefinedLocs.forEach((location) => {
            const isStarting = startingLoc && startingLoc.id === location.id;
            const point = new atlas.Shape(
                new atlas.data.Point([location.lng, location.lat]),
                location.id.toString(),
                {
                    title: location.name,
                    description: location.address,
                    locationType: location.type,
                    isStarting: isStarting
                }
            );
            predefinedDataSource.add([point]);
        });

        // Add chat-extracted locations
        locs.forEach((location) => {
            const point = new atlas.Shape(
                new atlas.data.Point([location.lng, location.lat]),
                location.id.toString(),
                {
                    title: location.name,
                    description: `Added by ${location.addedBy}`,
                    locationType: 'extracted',
                    isStarting: false
                }
            );
            dataSource.add([point]);
        });

        // Remove existing symbol layers
        const existingLayers = map.layers.getLayers().filter(layer => 
            layer instanceof atlas.layer.SymbolLayer && 
            (layer.getId() === 'predefined-layer' || layer.getId() === 'extracted-layer' || !layer.getId())
        );
        existingLayers.forEach(layer => map.layers.remove(layer));

        // Add layer for predefined locations with conditional styling
        const predefinedLayer = new atlas.layer.SymbolLayer(predefinedDataSource, 'predefined-layer', {
            textOptions: {
                textField: ['get', 'title'],
                offset: [0, -2],
                color: 'black',
                haloColor: 'white',
                haloWidth: 2,
                size: 12
            },
            iconOptions: {
                image: [
                    'case',
                    ['get', 'isStarting'], 'pin-round-yellow',  // Starting location
                    ['==', ['get', 'locationType'], 'venue'], 'pin-round-red',  // Venues
                    'pin-round-darkblue'  // Hotels
                ],
                anchor: 'center',
                size: [
                    'case',
                    ['get', 'isStarting'], 1.2,  // Make starting location larger
                    1.0
                ]
            }
        });
        map.layers.add(predefinedLayer);

        // Add layer for chat-extracted locations
        const extractedLayer = new atlas.layer.SymbolLayer(dataSource, 'extracted-layer', {
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
        map.layers.add(extractedLayer);

        // Set camera to fit all locations
        const allLocations = [...predefinedLocs, ...locs];
        if (allLocations.length > 0) {
            if (allLocations.length === 1) {
                map.setCamera({
                    center: [allLocations[0].lng, allLocations[0].lat],
                    zoom: 14
                });
            } else {
                const lngs = allLocations.map(loc => loc.lng);
                const lats = allLocations.map(loc => loc.lat);
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
                    padding: 80
                });
            }
        } else {
            map.setCamera({
                center: [-77.0369, 38.9072],
                zoom: 12
            });
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
            
            // Data source for chat-extracted locations
            const dataSource = new atlas.source.DataSource();
            map.sources.add(dataSource);
            dataSourceRef.current = dataSource;

            // Data source for predefined locations (venues and hotels)
            const predefinedDataSource = new atlas.source.DataSource();
            map.sources.add(predefinedDataSource);
            predefinedDataSourceRef.current = predefinedDataSource;

            const drivingRouteDataSource = new atlas.source.DataSource();
            map.sources.add(drivingRouteDataSource);
            drivingRouteDataSourceRef.current = drivingRouteDataSource;

            const walkingRouteDataSource = new atlas.source.DataSource();
            map.sources.add(walkingRouteDataSource);
            walkingRouteDataSourceRef.current = walkingRouteDataSource;

            // Initial marker update - always show predefined locations
            updateMarkers(map, dataSource, predefinedDataSource, [], predefinedLocations, startingLocation);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.dispose();
                mapInstanceRef.current = null;
                dataSourceRef.current = null;
                predefinedDataSourceRef.current = null;
                isMapReadyRef.current = false;
            }
        };
    }, [predefinedLocations, startingLocation, updateMarkers]); 

    const calculateRoutes = useCallback(async (locs) => {
        if (locs.length < 2) {
            setRouteInfo(null);
            if (drivingRouteDataSourceRef.current) {
                drivingRouteDataSourceRef.current.clear();
            }
            if (walkingRouteDataSourceRef.current) {
                walkingRouteDataSourceRef.current.clear();
            }
            return;
        }

        const subscriptionKey = process.env.REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY;
        if (!subscriptionKey) {
            return;
        }

        setLoadingRoutes(true);

        try {
            const routePromises = [];
            
            for (let i = 0; i < locs.length - 1; i++) {
                const origin = locs[i];
                const destination = locs[i + 1];
                
                const drivingPromise = fetch(
                    `https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${origin.lat},${origin.lng}:${destination.lat},${destination.lng}&travelMode=car`
                ).then(res => res.json());

                const walkingPromise = fetch(
                    `https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${origin.lat},${origin.lng}:${destination.lat},${destination.lng}&travelMode=pedestrian`
                ).then(res => res.json());

                routePromises.push({ driving: drivingPromise, walking: walkingPromise, from: origin, to: destination });
            }

            const results = await Promise.all(
                routePromises.map(async ({ driving, walking, from, to }) => {
                    try {
                        const [drivingResponse, walkingResponse] = await Promise.all([driving, walking]);
                        
                        if (drivingResponse.error || walkingResponse.error) {
                            console.error('Route API error:', drivingResponse.error || walkingResponse.error);
                            return {
                                from: from.name,
                                to: to.name,
                                drivingTime: 0,
                                walkingTime: 0,
                                drivingDistance: 0,
                                walkingDistance: 0,
                                drivingRoute: [],
                                walkingRoute: [],
                                error: true
                            };
                        }
                        
                        const drivingTime = drivingResponse.routes?.[0]?.summary?.travelTimeInSeconds || 0;
                        const walkingTime = walkingResponse.routes?.[0]?.summary?.travelTimeInSeconds || 0;
                        const drivingDistance = drivingResponse.routes?.[0]?.summary?.lengthInMeters || 0;
                        const walkingDistance = walkingResponse.routes?.[0]?.summary?.lengthInMeters || 0;

                        let drivingRoute = [];
                        let walkingRoute = [];
                        
                        if (drivingResponse.routes?.[0]?.legs?.[0]?.points) {
                            const points = drivingResponse.routes[0].legs[0].points;
                            drivingRoute = points.map(pt => {
                                if (Array.isArray(pt)) {
                                    return [pt[1], pt[0]]; // Convert [lat, lng] to [lng, lat]
                                }
                                return [pt.longitude || pt.lng, pt.latitude || pt.lat];
                            });
                        }
                        
                        if (walkingResponse.routes?.[0]?.legs?.[0]?.points) {
                            const points = walkingResponse.routes[0].legs[0].points;
                            walkingRoute = points.map(pt => {
                                if (Array.isArray(pt)) {
                                    return [pt[1], pt[0]];
                                }
                                return [pt.longitude || pt.lng, pt.latitude || pt.lat];
                            });
                        }

                        return {
                            from: from.name,
                            to: to.name,
                            drivingTime,
                            walkingTime,
                            drivingDistance,
                            walkingDistance,
                            drivingRoute,
                            walkingRoute,
                            error: false
                        };
                    } catch (error) {
                        console.error('Error processing route:', error);
                        return {
                            from: from.name,
                            to: to.name,
                            drivingTime: 0,
                            walkingTime: 0,
                            drivingDistance: 0,
                            walkingDistance: 0,
                            drivingRoute: [],
                            walkingRoute: [],
                            error: true
                        };
                    }
                })
            );

            const totalDrivingTime = results.reduce((sum, r) => sum + r.drivingTime, 0);
            const totalWalkingTime = results.reduce((sum, r) => sum + r.walkingTime, 0);
            const totalDrivingDistance = results.reduce((sum, r) => sum + r.drivingDistance, 0);
            const totalWalkingDistance = results.reduce((sum, r) => sum + r.walkingDistance, 0);

            setRouteInfo({
                segments: results,
                totalDrivingTime,
                totalWalkingTime,
                totalDrivingDistance,
                totalWalkingDistance
            });

            if (mapInstanceRef.current && drivingRouteDataSourceRef.current && walkingRouteDataSourceRef.current) {
                drivingRouteDataSourceRef.current.clear();
                walkingRouteDataSourceRef.current.clear();
                
                const existingDrivingLayer = mapInstanceRef.current.layers.getLayers().find(
                    layer => layer instanceof atlas.layer.LineLayer && layer.getId() === 'driving-route-layer'
                );
                if (existingDrivingLayer) {
                    mapInstanceRef.current.layers.remove(existingDrivingLayer);
                }

                const existingWalkingLayer = mapInstanceRef.current.layers.getLayers().find(
                    layer => layer instanceof atlas.layer.LineLayer && layer.getId() === 'walking-route-layer'
                );
                if (existingWalkingLayer) {
                    mapInstanceRef.current.layers.remove(existingWalkingLayer);
                }
                
                results.forEach((segment) => {
                    if (segment.drivingRoute && segment.drivingRoute.length > 0 && !segment.error) {
                        try {
                            const routeLine = new atlas.data.LineString(segment.drivingRoute);
                            drivingRouteDataSourceRef.current.add(new atlas.Shape(routeLine, null, {
                                strokeColor: '#1976d2',
                                strokeWidth: 4
                            }));
                        } catch (error) {
                            console.error('Error drawing driving route:', error);
                        }
                    }
                });

                results.forEach((segment) => {
                    if (segment.walkingRoute && segment.walkingRoute.length > 0 && !segment.error) {
                        try {
                            const routeLine = new atlas.data.LineString(segment.walkingRoute);
                            walkingRouteDataSourceRef.current.add(new atlas.Shape(routeLine, null, {
                                strokeColor: '#d32f2f',
                                strokeWidth: 4
                            }));
                        } catch (error) {
                            console.error('Error drawing walking route:', error);
                        }
                    }
                });

                if (results.some(r => r.drivingRoute && r.drivingRoute.length > 0 && !r.error)) {
                    const drivingRouteLayer = new atlas.layer.LineLayer(drivingRouteDataSourceRef.current, null, {
                        strokeColor: '#1976d2',
                        strokeWidth: 4
                    });
                    mapInstanceRef.current.layers.add(drivingRouteLayer);
                }

                if (results.some(r => r.walkingRoute && r.walkingRoute.length > 0 && !r.error)) {
                    const walkingRouteLayer = new atlas.layer.LineLayer(walkingRouteDataSourceRef.current, null, {
                        strokeColor: '#d32f2f',
                        strokeWidth: 4
                    });
                    mapInstanceRef.current.layers.add(walkingRouteLayer);
                }
            }
        } catch (error) {
            console.error('Error calculating routes:', error);
            setRouteInfo(null);
        } finally {
            setLoadingRoutes(false);
        }
    }, []);

    useEffect(() => {
        if (!isMapReadyRef.current || !mapInstanceRef.current || !dataSourceRef.current || !predefinedDataSourceRef.current) {
            return;
        }

        updateMarkers(mapInstanceRef.current, dataSourceRef.current, predefinedDataSourceRef.current, locations, predefinedLocations, startingLocation);
        
        // Combine starting location with other locations for route calculation
        let routeLocations = [...locations];
        if (startingLocation && routeLocations.length > 0) {
            // Remove starting location if it exists in the locations array
            routeLocations = routeLocations.filter(loc => loc.name !== startingLocation.name);
            // Add starting location at the beginning
            routeLocations = [startingLocation, ...routeLocations];
        }
        
        if (routeLocations.length >= 2) {
            calculateRoutes(routeLocations);
        } else {
            setRouteInfo(null);
        }
    }, [locations, predefinedLocations, startingLocation, updateMarkers, calculateRoutes]);

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
            {locations.length >= 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ marginBottom: '12px', color: 'black', fontWeight: 'bold' }}>
                        Travel Times:
                    </Typography>
                    {loadingRoutes ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                                Calculating routes...
                            </Typography>
                        </Box>
                    ) : routeInfo ? (
                        <Box>
                            {startingLocation && (
                                <Paper elevation={1} sx={{ p: 1.5, mb: 2, backgroundColor: '#fff9c4', borderLeft: '4px solid #fbc02d' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                                        🎯 Starting from: {startingLocation.name}
                                    </Typography>
                                </Paper>
                            )}
                            <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: 'black' }}>
                                    Total Travel Time:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DirectionsCarIcon sx={{ color: '#1976d2' }} />
                                        <Typography variant="body2">
                                            <strong>Driving:</strong> {Math.round(routeInfo.totalDrivingTime / 60)} min
                                            {' '}({Math.round(routeInfo.totalDrivingDistance / 1000 * 10) / 10} km)
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DirectionsWalkIcon sx={{ color: '#d32f2f' }} />
                                        <Typography variant="body2">
                                            <strong>Walking:</strong> {Math.round(routeInfo.totalWalkingTime / 60)} min
                                            {' '}({Math.round(routeInfo.totalWalkingDistance / 1000 * 10) / 10} km)
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                            
                            {routeInfo.segments.map((segment, index) => (
                                <Paper key={index} elevation={1} sx={{ p: 1.5, mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        {index === 0 && startingLocation ? '🎯 ' : ''}{segment.from} → {segment.to}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <DirectionsCarIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                                            <Typography variant="caption">
                                                {Math.round(segment.drivingTime / 60)} min
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <DirectionsWalkIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
                                            <Typography variant="caption">
                                                {Math.round(segment.walkingTime / 60)} min
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    ) : null}
                </Box>
            )}
        </div>
    );
};

export default Map;

