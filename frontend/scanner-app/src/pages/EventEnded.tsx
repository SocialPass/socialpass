/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import CloseCircleIcon from "../assets/closeIcon.svg";
import nftyBg from "../assets/nftyBg.png";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function EventClosed() {
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <>
      <header className="d-flex flex-row justify-content-between align-items-start py-4 px-4">
        <div className="card rounded p-1">
          <FiArrowLeft onClick={handleGoBack} size={22} />
        </div>
        <h2>Invalid</h2>
      </header>
      <div className="d-flex flex-column align-items-center justify-content-center gap-4">
        <div>
          <img src={CloseCircleIcon} />
        </div>
        <span className="fw-bold fs-6">The event has ended.</span>
        <img src={nftyBg} />
      </div>
    </>
  );
}
