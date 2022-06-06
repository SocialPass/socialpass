/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/Header";
import QrReader from "react-qr-reader";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function Scanner() {
  const {
    scanTicket,
    eventData,
  }: any = useTicket();

  const [loading, setLoading] = useState<Boolean>(true);
  const navigate = useNavigate();

  const handleScan = useCallback(
    async (qrcode: any) => {
      if (qrcode) {
        scanTicket(qrcode);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleError = useCallback((err: any) => {
    console.log(err);
  }, []);

  useEffect(() => {
    if (eventData && eventData.ticket_count == eventData.redemeed_count){
      navigate("/capacity-reached");
    }
    setLoading(false);
  })

  if (loading){
    return <></>
  }

  return (
    <div className="scanner-body">
      <Header
        total={eventData?.ticket_count}
        attendees={eventData?.redemeed_count}
        title={eventData?.title}
      />
      <div className="bg-body rounded mx-10">
        <div className="d-flex justify-content-center align-items-center p-5">
          <QrReader
            facingMode={"environment"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
