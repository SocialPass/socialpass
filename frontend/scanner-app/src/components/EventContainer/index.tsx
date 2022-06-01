import React from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "../../pages/Scanner"



type EventContainerProps = {
  event_name: String;
  event_attendance: number;
  event_date: String;
  event_venue: String;
};

export function EventContainer({ event_name, event_attendance, event_date, event_venue }: EventContainerProps) {

  return (
    <div className="container p-10 d-flex flex-column align-items-center">
        <div className="landing-page-event-title">{event_name}</div>
        <div className="card background-image">
          <div className="landing-page-card-text-1">Total Attendance:</div>
          <div className="landing-page-card-text-2">{event_attendance}</div>
          <div className="landing-page-card-text-1">Date:</div>
          <div className="landing-page-card-text-2">{event_date}</div>
          <div className="landing-page-card-text-1">Venue</div>
          <div className="landing-page-card-text-2">{event_venue}</div>
        </div>  
        <div className="container p-20 d-flex flex-column">

          <button className="btn-rounded" onClick={Scanner}>
            <h5>Start Scanning</h5>
          </button>
        </div>
      </div>
    );
}