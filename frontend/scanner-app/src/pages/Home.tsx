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
        event_name={eventData.event_name}
        event_attendance={eventData.event_attendance}
        event_date={eventData.event_date} 
        event_venue={eventData.event_venue}
      />

    </>
  );
}