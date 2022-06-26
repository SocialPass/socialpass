import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { useEvent } from "../../contexts/EventContext";
import { fetchTickets } from "../../services/api";

export function StatisticsTable() {
  const { publicId }: any = useEvent();
  let isRedeemed = true;

  function claimed()  {
    isRedeemed = true
    console.log("isRedeemed: ", isRedeemed)
  }
  function unclaimed()  {
    isRedeemed = false
    console.log("isRedeemed: ", isRedeemed)
  }







  const { isLoading, isError, error, data } = useQuery(
    ["fetchTickets", publicId],
    () => fetchTickets(publicId, isRedeemed)
  );

  if (isLoading) return <>Loading</>;
  if (isError) return <>Oops something went wrong</>;

  function ticketCount(data: { hasOwnProperty: (arg0: string) => any }) {
    var result = 0;
    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
      }
    }
    return console.log("Resultado: ", result);

    

  }
  
  return (
    <div>
    <div className="d-flex flex-row align-items-center px-20">
          <button className="btn-selected-statistic flex-grow-1" onClick={claimed}>
            Claimed
          </button>
          <button className="btn-selected-statistic flex-grow-1" onClick={unclaimed}>
            Unclaimed
          </button>
        </div>
    <div className="statistics-table-container d-flex flex-column align-items-center p-10">
      <table>
        <thead>
          <tr>
            <th>Issued at</th>
            <th>Wallet Address</th>
            <th>Redeemed at</th>
          </tr>
        </thead>
        <tbody>
        {console.log("data.map Executed")}
          {data.map((ticket: any) => (
            <tr key={ticket.public_id}>
              <td>{ticket.created}</td>
              <td>{ticket.wallet_address}</td>
              <td>{ticket.redeemed_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
