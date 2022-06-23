import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../../contexts/EventContext";

type FooterProps = {
  event_name: String;
  event_attendance: number;
  event_date: String;
  event_venue: String;
};

export function Footer({
  event_name,
  event_attendance,
  event_date,
  event_venue,
}: FooterProps) {
  const { data: eventData }: any = useEvent();
  const navigate = useNavigate();

  function handleRedirect() {
    navigate("../statistics");
  }

  return (
    <div className="d-flex flex-column py-10 px-30 justify-content-center align-items-center">
      <div className="d-flex flex-column w-100">
        <div className="scanner-title mt-10">{event_name}</div>
        <div className="scanner-subtitle">
          {event_venue} | {event_date}
        </div>
        <div className="d-flex flex-row justify-content-between">
          <div className="live-statistics-btn-blue text-center flex-grow-1">
            Accepted {eventData.redemeed_count}
          </div>
          <div className="live-statistics-btn-orange text-center flex-grow-1">
            Remaining {eventData.ticket_count - eventData.redemeed_count}
          </div>
        </div>
      </div>
      <button
        className="btn-statistics w-100 mb-20 mt-20"
        onClick={handleRedirect}
      >
        Statistics
      </button>
    </div>
  );
}
