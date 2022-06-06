/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import CloseCircleIcon from "../assets/closeIcon.svg";
import nftyBg from "../assets/nftyBg.png";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function CapacityReached() {
  const navigate = useNavigate();

  function handleGoBack() {
    navigate("/home");
  }

  return (
    <>
      <header className="d-flex flex-row justify-content-between align-items-start py-4 px-4">
        <div className="card rounded p-1">
          <FiArrowLeft onClick={handleGoBack} size={22} />
        </div>
        <h2>Capacity</h2>
      </header>
      <div className="d-flex flex-column align-items-center justify-content-center gap-4">
        <div>
          <img src={CloseCircleIcon} />
        </div>
        <span className="fw-bold fs-6">
          Event capacity has reached it's limit. All the generated tickets have been scanned.
        </span>
        <img src={nftyBg} />
      </div>
    </>
  );
}
