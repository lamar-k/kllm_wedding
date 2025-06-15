import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from 'react';
import Home from './Views/Home/Home';
import weddingLogo from './images/LK_CREST_BLACK_WHITE.png';


function App() {
  return (
    <div className="App">
                      <img src={weddingLogo} alt="LK Wedding Logo" className="logo"
                style={{display:'flex', width:'100%', maxHeight:'20vh', objectFit:'contain', marginBottom:'-10px', marginTop:'10px'}}
                />
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
