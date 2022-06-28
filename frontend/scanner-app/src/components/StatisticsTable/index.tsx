import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { useEvent } from "../../contexts/EventContext";
import { fetchTickets } from "../../services/api";

export function StatisticsTable() {
  const { publicId }: any = useEvent();
  const [isRedeemed, setIsRedeemed]= useState(true);

  function claimed()  {
    setIsRedeemed(() => true)
    console.log("isRedeemed: ", isRedeemed)
  }
  function unclaimed()  {
    setIsRedeemed(() => false)
    console.log("isRedeemed: ", isRedeemed)
  }



  const { isLoading, isError, error, data } = useQuery(
    ["fetchTickets", isRedeemed],
    () => fetchTickets(publicId, isRedeemed)
  );
  

/*  const { isLoading, isError, error, data } = useQuery(
    "fetchTickets", () => fetchTickets(publicId, isRedeemed)
  );
*/
  if (isLoading) return <>Loading</>;
  if (isError) return <>Oops something went wrong</>;


  
  return (
    <div>
    <div className="d-flex flex-row align-items-center px-20">
          <button className="btn-selected-statistic flex-grow-1" onClick={()=> setIsRedeemed(() => true)}>
            Claimed
          </button>
          <button className="btn-selected-statistic flex-grow-1" onClick={()=> setIsRedeemed(() => false)}>
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
