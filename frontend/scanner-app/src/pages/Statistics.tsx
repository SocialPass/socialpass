/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { StatisticsTable } from "../components/StatisticsTable/index";
import { FiX } from "react-icons/fi";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";


export function Statistics() {
  const navigate = useNavigate();
  const params = useParams();
  const { setEventData, bustEventDataCache }: any = useEvent();

  function handleRedirect() {
    navigate("/Home");
  }

  useEffect(() => {
    api.get(
      `scanner/landing/${params.publicId}/`
    ).then((response) => {
      setEventData({...response.data, redemption_code: params.publicId});
      navigate("/home");
    }).catch((error) => {
      bustEventDataCache();
      navigate("error");
    });
  }, []);

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
