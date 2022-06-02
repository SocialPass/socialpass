/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";
import { EventContainer } from "../components/EventContainer"
import Logo from "../static/images/landingpage_logo.png"

export function Home() {
  const { statusEvent, eventData }: any = useTicket();
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <>
  <div className="landing-page-body p-10 py-50">
    <div className="d-flex flex-column align-items-center justify-content-around">
      <img className="p-30" src={Logo}/>
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
