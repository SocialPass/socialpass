/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { StatisticsTable } from "../components/StatisticsTable/index";
import { FiArrowLeft } from "react-icons/fi";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";


export function Statistics() {
  const navigate = useNavigate();
  const params = useParams()

  return (
    <div className="scanner-body">
      <div className="btn-close">
          <FiArrowLeft onClick={() => {navigate(-1)}} size={26} />
      </div>
      <StatisticsTable/>
      <div className="landing-page-card background-image">
        <div className="landing-page-card-text-1">Total Attendance:</div>
        <div className="container p-20 d-flex flex-column">
          <button className="btn-start-scanning" onClick={() => {navigate(`/${params.publicId}/scanner`)}}>
            Start Scanning
          </button>
        </div>
      </div>
    </div>
  );
}
