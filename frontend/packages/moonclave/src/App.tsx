import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Greeting } from '@nfty/shared';
import { Home, DayOne, DayTwo } from './pages'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Visa MoonClave!</h1>
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
