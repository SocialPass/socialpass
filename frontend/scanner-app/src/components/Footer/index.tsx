import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useEvent } from "../../contexts/EventContext";

type FooterProps = {
  waitingForScan?: Boolean;
};

export function Footer({ waitingForScan }: FooterProps) {
  const { eventData }: any = useEvent();
  const navigate = useNavigate();

  function handleRedirect() {
    navigate("../statistics");
  }
  return (
    <div className="d-flex flex-column py-10 px-30 justify-content-center align-items-center">
      <div className="d-flex flex-column w-100">
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="scanner-title mt-20">{eventData.title}</div>
          {waitingForScan && <HashLoader color="#EF7C4E" size={25} />}
        </div>
        <div className="scanner-subtitle">
          {eventData.location} | {eventData.start_date}
        </div>
        <div className="d-flex flex-row justify-content-between">
          <div className="live-statistics-btn-blue text-center flex-grow-1">
            Accepted {eventData.redeemed_count}
          </div>
          <div className="live-statistics-btn-orange text-center flex-grow-1">
            Remaining {eventData.capacity - eventData.redeemed_count}
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
