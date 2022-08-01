/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { StatisticsTable } from "../components/StatisticsTable/index";
import { CopyrightFooter } from "../components/CopyrightFooter";
import { FiArrowLeft } from "react-icons/fi";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";

export function Statistics() {
  const navigate = useNavigate();
  const params = useParams();
  const { eventData }: any = useEvent();

  return (
    <div className="statistics-body">
      <div className="statistics-title py-20 px-10">
        {eventData.title}
        <StatisticsTable />
        <div className="container p-5 d-flex flex-column">
          <button
            className="btn-start-scanning"
            onClick={() => {
              navigate(`/${params.publicId}/scanner`);
            }}
          >
            Return to Scanner
          </button>
        </div>
        <CopyrightFooter/>
      </div>
    </div>
  );
}
