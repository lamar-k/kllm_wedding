import React from "react";
import weddingLogo from "../../images/LK_CREST_2.png";
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div>
                <img src={weddingLogo} alt="LK Wedding Logo" className="logo"
                style={{display:'flex', width:'100%', maxHeight:'20vh', objectFit:'contain', marginBottom:'-10px', marginTop:'10px'}}
                />
            </div>
            <div className="header-text">
               <h2 style={{color:'#B8663A'}} className="script_subtext">Lauren + Ken</h2>
            </div>

            {/* <div style={{display:'flex', flexDirection:'row'}}>
            <div style={{position:'relative'}}>
                <div className="head-image">
                    <img src={weddingPhoto} alt="LK Wedding Logo" className="logo"
                    style={{maxHeight:'100vh', display:'flex', width:'auto'}}/>
                </div>
                <div className="head-text" style={{position:'absolute', right:'50%', left:'8%', bottom:'12%', width:'800px'}}>
                    <p style={{color:'white'}} className={'script_text'}>Lauren & <br></br>Ken </p>
                    <p style={{color:'white'}} className='script_subtext'>We're getting married!</p>
                </div>
            </div>
            <div>
                <img src={weddingLogo} alt="LK Wedding Logo" className="logo"
                style={{display:'flex', width:'100%', maxHeight:'100vh'}}/>
            </div>
            </div> */}
        </div>
    );
    }
export default Home;