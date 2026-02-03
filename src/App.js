import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import Home from './Views/Home/Home';
import weddingLogo from './images/LK_CREST_BLACK_WHITE.png';
import FAQ from './Views/FAQ/FAQ';
import Schedule from './Views/Schedule/Schedule';
import Gallery from './Views/Gallery/Gallery';
import Travel from './Views/Travel/Travel';
import Activities from './Views/Activities/Activities';
import Registry from './Views/Registry/Registry';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');


  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const correctPasscode = process.env.REACT_APP_PASSCODE;
    
    // Debug logging - you can remove this later
    if (passcodeInput === correctPasscode) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect passcode. Please try again.');
      setPasscodeInput('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="App" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <img 
          src={weddingLogo} 
          alt="LK Wedding Logo" 
          style={{
            width: '100%',
            maxWidth: '300px',
            maxHeight: '200px',
            objectFit: 'contain',
            marginBottom: '30px'
          }}
        />
        <h2 style={{ marginBottom: '20px', fontFamily: 'inherit' }}>Enter Passcode</h2>
        <form onSubmit={handlePasscodeSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter passcode"
              style={{
                padding: '12px 45px 12px 15px',
                fontSize: '16px',
                width: '100%',
                border: '2px solid #ccc',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '5px 8px',
                color: '#666',
                fontWeight: '500'
              }}
              aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
            >
              {showPasscode ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && (
            <p style={{
              color: 'red',
              margin: '0',
              fontSize: '14px'
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'inherit'
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <img src={weddingLogo} alt="LK Wedding Logo" className="logo"
        style={{display:'flex', width:'100%', maxHeight:'20vh', objectFit:'contain', marginBottom:'-10px', marginTop:'10px'}}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/schedule" element={<Schedule/>} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/faq" element={<FAQ/>} />
          <Route path="/travel" element={<Travel/>} />
          <Route path="/things-to-do" element={<Activities/>} />
          <Route path="/registry" element={<Registry/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
