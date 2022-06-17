/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { StatisticsTable } from "../components/StatisticsTable/index";
import { FiX } from "react-icons/fi";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function Statistics() {
  
  const navigate = useNavigate();
  
  function handleRedirect() {
    navigate("/Home");
  }

  return (
    <div className="scanner-body">
      <div className="btn-close">
          <FiX onClick={handleRedirect} size={26} />
      </div>
      
      <StatisticsTable
      />

    </div>
  );
}
