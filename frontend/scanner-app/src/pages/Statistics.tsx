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
  const isStatisticsPageFinished = false;
  const { eventData }: any = useEvent();

  function handleRedirect() {
    navigate("../scanner");
  }


  if (isStatisticsPageFinished == false) {
    
  
  return (
    <div className="error-footer">
      <div className="position-absolute top-auto bottom-50">
        <div className="d-flex flex-column align-items-center justify-content-center gap-30">
          <span className="error-title fs-20">Coming Soon!</span>
          <span className="error-body px-20">
            The Statistics page will soon be available for all users. 
          </span>
        </div>
        <div className="p-20">
    <button
      className="btn-statistics w-100 mb-20 mt-20 p-20"
      onClick={handleRedirect}
    >
      Back to the Scanner
    </button>
  </div>
      </div>
      
    </div>
  
  );
  
  }

  else  {
  return (
    <div className="statistics-body">
      <div className="statistics-title py-20 px-10">
        {eventData.title}
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

}
