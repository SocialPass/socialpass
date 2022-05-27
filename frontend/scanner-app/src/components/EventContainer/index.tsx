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
    <h3>Teste</h3>  );
}