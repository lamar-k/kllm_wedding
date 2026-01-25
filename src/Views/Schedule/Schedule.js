import React from "react";
import Navigation from "../../Components/Navigation/Navigation";
import Timeline from'@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';
import MapRedirectFunction from "../../Functions/MapRedirectFunction";
import LiquorRounded from '@mui/icons-material/LiquorRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import LocalBarRounded from '@mui/icons-material/LocalBarRounded';
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';

function Schedule() {
    return (
        <div className="schedule">
            <Navigation />
            <div>
            <h2>Friday, June 12, 2026</h2>
            <Timeline>
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    8:00 PM
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        <LiquorRounded sx={{ color: 'black', fontSize:'20px' }} />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Welcome Drinks
                    </Typography>
                    <Typography>Come join us for welcome drinks!</Typography>
                    <Typography>Shuttles will be provided from hotels to the venue</Typography>
                    <Typography>The Salt Line</Typography>
                    <Typography>79 Potomac Ave SE, Washington, DC 20003</Typography>
                    <div style={{marginLeft:'30px'}}>
                    <MapRedirectFunction  latitude={process.env.REACT_APP_SL_LONG} longitude={process.env.REACT_APP_SL_LAT} label="The Salt Line"/>
                    </div>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
            </div>
            <div>
                <h2>Saturday, June 13, 2026</h2>
                <Timeline >
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    5:30 PM
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        <FavoriteRounded sx={{ color: 'black', fontSize:'20px' }} />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Arrival
                    </Typography>
                    <Typography>Block hotels are within a 5 min walking distance</Typography>
                    <Typography>The Iron Gate</Typography>
                    <Typography>1734 N St NW, Washington, DC 20036</Typography>
                    <div style={{marginLeft:'30px'}}>
                    <MapRedirectFunction  latitude={process.env.REACT_APP_IG_LONG} longitude={process.env.REACT_APP_IG_LAT} label="The Iron Gate"/>
                    </div>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    5:45 PM
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        <FavoriteRounded sx={{ color: 'black', fontSize:'20px' }} />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Ceremony Begins
                    </Typography>
                    <Typography>The Iron Gate</Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    6:00 PM
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        <LocalBarRounded sx={{ color: 'black', fontSize:'20px' }} />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Cocktail Hour
                    </Typography>
                    <Typography>The Iron Gate</Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    6:45 PM - 10:45PM
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        <RestaurantMenuRounded sx={{ color: 'black', fontSize:'20px' }} />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Reception
                    </Typography>
                    <Typography>The Iron Gate</Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    11:00 PM - 2:00 AM
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        <CelebrationRoundedIcon sx={{ color: 'black', fontSize:'20px' }} />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        After Party
                    </Typography>
                    <Typography>Join us for an after party at The Church Key</Typography>
                    <Typography>The Church Key</Typography>
                    <Typography>1337 14th St NW, Washington, DC 20005</Typography>
                    <div style={{marginLeft:'30px'}}>
                    <MapRedirectFunction  latitude={process.env.REACT_APP_CK_LONG} longitude={process.env.REACT_APP_CK_LAT} label="Chruch Key"/>
                    </div>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
            </div>
        </div>
    );
}


export default Schedule;