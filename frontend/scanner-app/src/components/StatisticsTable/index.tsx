import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./data.json";

export function StatisticsTable() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(data);

  return (
    <div className="container p-10 d-flex flex-column align-items-center">
      <div>
        <thead>
          <tr>
            <th>Issued at</th>
            <th>Wallet Address</th>
            <th>Redeemed at</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((tickets) => (
            <tr>
              <td>{tickets.issued_at}</td>
              <td>{tickets.blockchain_ownership}</td>
              <td>{tickets.redeemed_at}</td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
}
