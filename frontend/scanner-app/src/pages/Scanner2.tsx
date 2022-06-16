/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { FiX } from "react-icons/fi";
import QrReader from "react-qr-reader";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function Scanner2() {
  const {
    scanTicket,
    eventData,
  }: any = useTicket();

  const [loading, setLoading] = useState<Boolean>(true);
  const [qrCode, setQrcode] = useState(null);
  const navigate = useNavigate();

  const handleScan = useCallback(
    async (qrcode: any) => {
      if (qrcode) {
        console.log(qrcode);
        setQrcode(qrcode);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if(qrCode){
      console.log(qrCode);
      scanTicket(qrCode);
    }
  }, [qrCode])

  const handleError = useCallback((err: any) => {
    console.log(err);
  }, []);

  useEffect(() => {
    if (eventData && eventData.ticket_count == eventData.capacity) {
      setTimeout(function () {
        navigate("/capacity-reached");
      }, 1000);
    }
    setLoading(false);
  })
  function handleRedirect() {
    navigate("/Home");
  }



  if (loading){
    return <></>
  }

  return (
    <div className="scanner-body">
      <div className="btn-close">
          <FiX onClick={handleRedirect} size={26} />
      </div>
      <div>
        <div className="d-flex justify-content-center align-items-center p-10">
          <QrReader
            facingMode={"environment"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <Footer
        event_name={eventData.title}
        event_attendance={eventData.capacity}
        event_date={eventData.date}
        event_venue={eventData.location}
      />
    </div>
  );
}
