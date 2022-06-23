/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { StatisticsTable } from "../components/StatisticsTable/index";
import { FiArrowLeft } from "react-icons/fi";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

export function Statistics() {
  const navigate = useNavigate();
  const params = useParams();
  const { data: eventData }: any = useEvent();

  return (
    <div className="statistics-body">
      <div className="statistics-title py-20 px-10">
        {eventData.title}
        <div className="d-flex flex-row align-items-center px-20">
          <button className="btn-selected-statistic flex-grow-1">Claimed</button>
          <button className="btn-selected-statistic flex-grow-1">Unclaimed</button>
        </div>

        <StatisticsTable />
        <div className="container p-20 d-flex flex-column">
          <button
            className="btn-return-to-scanner"
            onClick={() => {
              navigate(`/${params.publicId}/scanner`);
            }}
          >
            Return to Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
