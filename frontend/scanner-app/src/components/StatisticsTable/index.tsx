import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



export function StatisticsTable() {
  const navigate = useNavigate();
  function handleRedirect() {
    navigate("/scanner");
  }
  return (
    <div className="container p-10 d-flex flex-column align-items-center">
      <div className="landing-page-card background-image">
        <div className="landing-page-card-text-1">Total Attendance:</div>        
      <div className="container p-20 d-flex flex-column">
        <button className="btn-start-scanning" onClick={handleRedirect}>
          Start Scanning
        </button>
      </div>
    </div>
    <div>
      <thead>
        <tr>
        <th>Issued at</th>
        <th>Wallet Address</th>
        <th>Redeemed at</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td>Row 1</td>
        <td>Row 2</td>
        <td>Row 3</td>
        </tr>
      </tbody>
    </div>
    </div>

  );
}
