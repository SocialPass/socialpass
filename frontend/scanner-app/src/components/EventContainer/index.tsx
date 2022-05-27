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
    <body style={{width:"100%", height:"100%", margin: 20, borderColor: "red", borderWidth: 10, backgroundColor: "#fff", color:"#EB7347"}}>
      <h3 
      style={{textAlign: 'center', paddingBottom: 20}}
      >Event Name: {event_name}</h3>  
      <body style={{textAlign: 'left', paddingBottom: 20}}>
        <h4>Total Attendance: {event_attendance}</h4>  
        <h4>Date: {event_date}</h4>  
        <h4>Venue: {event_venue}</h4>  
      </body>
    </body>
    </>
    );
}