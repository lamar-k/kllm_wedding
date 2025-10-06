import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from 'react';
import Home from './Views/Home/Home';
import weddingLogo from './images/LK_CREST_BLACK_WHITE.png';
import FAQ from './Views/FAQ/FAQ';
import Schedule from './Views/Schedule/Schedule';
import Gallery from './Views/Gallery/Gallery';
import Travel from './Views/Travel/Travel';


function App() {
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
