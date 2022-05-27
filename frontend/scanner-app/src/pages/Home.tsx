import React, { useCallback } from "react";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";
import { EventContainer } from "../components/EventContainer";


export function Home() {
  const { fetchTicket, eventData }: any = useTicket();
  const navigate = useNavigate();

  const handleError = useCallback((err: any) => {
    console.log(err);
  }, []);

  return (
    
    <>
    
      <EventContainer
        event_name={"1"}
        event_attendance={1}
        event_date={"1"} 
        event_venue={"1"}
      />

    </>
  );
}