import React from "react";
import Navigation from "../../Components/Navigation/Navigation";
import Flight  from "@mui/icons-material/Flight";
import Train  from "@mui/icons-material/Train";
import { Typography, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Hotel from "@mui/icons-material/Hotel";


const Travel = () => {
    const handleOpenNewWindow = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return(
        <div>
            <Navigation/>
            <div>
                <Flight sx={{ fontSize: 50, color:'black', marginTop:'10px'}}/>
                <Typography variant="h5" sx={{marginTop:'20px', marginBottom:'20px'}}>Ronald Reagan Washington National Airport</Typography>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Ronald Reagan Washington National Airport (DCA) in the closest airport to the D.C. area - estimated time to hotels: 20 minutes driving</Typography>
                </div>
            </div>
            <div>
                <Typography variant="h5" sx={{marginTop:'20px', marginBottom:'20px'}}>Washington Dulles International Airport</Typography>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Washington Dulles International Airport (IDA) is a bit further out but has more flights (not recommended option) - estimated time to hotels: 45 minutes driving</Typography>
                </div>
            </div>
            <div>
                <Train sx={{ fontSize: 50, color:'black', marginTop:'10px'}}/>
                <Typography variant="h5" sx={{marginTop:'20px', marginBottom:'20px'}}>Union Station Washington DC</Typography>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Union station DC's central train station top, great for east coast travelers - estimated time to hotels: 15 minutes driving</Typography>
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <Divider sx={{marginTop:'40px', marginBottom:'40px', width:'85%'}}/>
            </div>

            <div>
                <Hotel sx={{ fontSize: 50, color:'black', marginTop:'10px'}}/>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <Typography variant="h5" sx={{marginTop:'20px', marginBottom:'20px'}}>Canopy by Hilton Washington DC Embassy Row</Typography>
                    </div>
                </div>
                <div>
                    <Typography sx={{fontStyle: 'italic', marginBottom:'20px'}}>1600 Rhode Island Ave NW, Washington, DC 20036</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Please use the link below to book reservation (group code automatically applied).</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Group code: MLW</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Hotel is right around the corner from the wedding venue - estimated walk time is 4 minutes!</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
                    <Button onClick={() => handleOpenNewWindow(process.env.REACT_APP_CANOPY_URL || 'https://www.hilton.com/en/book/reservation/rooms/?ctyhocn=DCAEMPY&arrivalDate=2026-06-12&departureDate=2026-06-14&groupCode=MLW&room1NumAdults=1&cid=OM%2CWW%2CHILTONLINK%2CEN%2CDirectLink')} variant="outlined" sx={{color:'black', 
                    transition: 'box-shadow 0.3s ease-in-out', borderColor:'black'
                    , '&:hover': {color:'white', borderColor:'white', backgroundColor:'black'}}}>
                        View
                    </Button>
                </div>



                <div style={{display:'flex', justifyContent:'center'}}>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <Typography variant="h5" sx={{marginTop:'20px', marginBottom:'20px'}}>Courtyard Dupont Circle by Marriott</Typography>
                    </div>
                </div>
                <div>
                    <Typography sx={{fontStyle: 'italic', marginBottom:'20px'}}>1733 N St NW, Washington DC, 20036</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Please use the link below to book reservation (group code automatically applied).</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Group code: LKWLKWA</Typography>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Typography sx={{marginBottom:'20px', maxWidth:'50%'}}>Hotel is right across the street from the venue!</Typography>
                </div>

                <div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
                    <Button onClick={() => handleOpenNewWindow(process.env.REACT_APP_MARRIOTT_URL || 'https://www.marriott.com/event-reservations/reservation-link.mi?id=1751564535836&key=GRP&app=resvlink')} variant="outlined" sx={{color:'black', 
                    transition: 'box-shadow 0.3s ease-in-out', borderColor:'black'
                    , '&:hover': {color:'white', borderColor:'white', backgroundColor:'black'}}}>
                        View
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default Travel;