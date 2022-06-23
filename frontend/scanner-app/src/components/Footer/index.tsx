import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type FooterProps = {
  event_name: String;
  event_attendance: number;
  event_date: String;
  event_venue: String;
};

export function Footer({ event_name, event_attendance, event_date, event_venue }: FooterProps) {
  const navigate = useNavigate();

  function handleRedirect() {
    navigate("../statistics");
  }

  return (
    <div className="d-flex flex-row py-4 px-4">
      <div className="d-flex flex-column py-10 px-10 justify-content-center">
        <div className="justify-content-center">
        <div className="scanner-title">{event_name}</div>
        <div className="scanner-subtitle">
          {event_venue} | {event_date}
        </div>
        <div className="d-flex flex-row">
          <div className="live-statistics-btn-blue ">Accepted 100</div>
          <div className="live-statistics-btn-orange">Remaining 900</div>
        </div>
        </div>
        <div className="d-flex flex-row justify-content-center py-4 px-4">
          <button className="btn-statistics" onClick={handleRedirect}>
            Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
