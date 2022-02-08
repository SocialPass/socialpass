import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { Ticketing, Airdrop } from './pages'

function App() {
  return (
    <div className="App">
      <div>
      <h2>NFTY Workbench</h2>
      <ul>
        <li><Link to="/ticket">Ticketing</Link></li>
        <li><Link to="/airdrop">Airdrop</Link></li>
      </ul>
      </div>
      <div style={{ display: "flex", justifyContent: "center", margin: '10rem'}}>
        <Routes>
          <Route index element={<Ticketing />} />
          <Route path="ticket" element={<Ticketing />} />
          <Route path="airdrop" element={<Airdrop />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
