import React from "react";
import { useNavigate } from "react-router-dom";



type EventContainerProps = {
  event_name: String;
  event_attendance: number;
  event_date: String;
  event_venue: String;
};

export function EventContainer({ event_name, event_attendance, event_date, event_venue }: EventContainerProps) {

  return (
    <>
    <body style={{width: 300, border: 15, padding: 50, margin: 20}}>
      <h3 style={{textAlign: 'center', paddingBottom: 20}}>Event Name: {event_name}</h3>  
      <h4>Total Attendance: {event_attendance}</h4>  
      <h4>Date: {event_date}</h4>  
      <h4>Venue: {event_venue}</h4>  
    </body>
    </>
    );
}