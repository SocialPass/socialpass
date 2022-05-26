import React from "react";
import { useNavigate } from "react-router-dom";


type EventContainerProps = {
  event_name: string;
  event_attendance: number;
  event_date: string;
  event_venue: string;
};

export function EventContainer({ event_name, event_attendance, event_date, event_venue }: EventContainerProps) {
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }
  return (
    <header className="d-flex flex-row justify-content-between py-4 px-4">
      <div className="py-2 ">
        
      </div>
      <div className="d-flex flex-column align-items-center">
        <h3>{event_name}</h3>
        <h3>Teste</h3>

      </div>
      <div></div>
    </header>
  );
}