import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { useEvent } from "../../contexts/EventContext";
import { fetchTickets } from "../../services/api";
import Table from "../Table";

export function StatisticsTable() {
  const { publicId }: any = useEvent();
  const [isRedeemed, setIsRedeemed]= useState(true);
  const element = document.getElementsByTagName("button");

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


  if (isLoading) return <>Loading</>;
  if (isError) return <>Oops something went wrong</>;

  
  return (
    <div>
    <div className="d-flex flex-row align-items-center px-20">
          <button className="btn-selected-statistic flex-grow-1" id="claimed-button" 
          onClick={
            /*function(){         
              element.innerHTML.remove(
                'btn-selected-statistic'
              );
              button.classList.add(
                'btn-really-selected-statistic'
              );
              }
                 */
              ()=> setIsRedeemed(() => true)
              
            }>
            Claimed
          </button>
          <button className="btn-selected-statistic flex-grow-1" onClick={()=> setIsRedeemed(() => false)}>
            Unclaimed
          </button>
        </div>
    <div className="statistics-table-container d-flex flex-column align-items-center p-10">
      <Table data={data} rowsPerPage={7} />
    </div>
    </div>
  );
}
