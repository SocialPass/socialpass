/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";
import { EventContainer } from "../components/EventContainer"

export function Home() {
  const { statusEvent, eventData }: any = useTicket();
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  return (
    /*
    <>
      <header className="d-flex flex-row justify-content-between align-items-start py-4 px-4">
        {statusEvent === "reached" ? <h2>Capacity</h2> : <h2>Invalid</h2>}
        <div></div>
      </header>
      <div className="d-flex flex-column align-items-center justify-content-center gap-4">
        {statusEvent === "reached" ? (
          <span className="fw-bold fs-6">
            Event capacity has reached it's limit
          </span>
        ) : (
          <span className="fw-bold fs-6">The event has ended</span>
        )}
      </div>
    </>
    */
    <>
  <div className="landing-page-body">
    <div>      
        {<h2 style={{textAlign: 'center'}}>SocialPass Logo</h2>}
        <div></div>
        <EventContainer
          event_name = {eventData[0].name}
          event_attendance = {eventData[0].attendance}
          event_date = {eventData[0].date}
          event_venue = {eventData[0].venue}
        />
      </div>
    </div>
  </>
  );
}