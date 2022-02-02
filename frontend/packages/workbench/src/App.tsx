import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { Home, Ticketing, Airdrop } from './pages'

function App() {
  return (
    <div className="App">
      <div>
      <h2>Component Pages</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/ticket">Ticketing</Link></li>
        <li><Link to="/airdrop">Airdrop</Link></li>
      </ul>
      </div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="ticket" element={<Ticketing />} />
          <Route path="airdrop" element={<Airdrop />} />
        </Routes>
    </div>
  );
}

export default App;
