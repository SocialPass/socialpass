import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { Home, DayOne, DayTwo } from './pages'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MoonClave!</h1>
        <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/day-one">Day One</Link></li>
        <li><Link to="/day-two">Day Two</Link></li>
        </ul>
        <Routes>
          <Route index element={<Home />} />
          <Route path="day-one" element={<DayOne />} />
          <Route path="day-two" element={<DayTwo />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
