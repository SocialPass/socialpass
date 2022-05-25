import React, { useCallback } from "react";
import { Header } from "../components/Header";
import QrReader from "react-qr-reader";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function Scanner() {
  const { fetchTicket, eventData }: any = useTicket();
  const navigate = useNavigate();

  const handleScan = useCallback(
    async (qrcode: any) => {
      if (qrcode) {
        fetchTicket(qrcode);
        navigate("/end-event");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleError = useCallback((err: any) => {
    console.log(err);
  }, []);

  return (
    <>
      <Header
        total={eventData.total}
        attendees={eventData.attendees}
        title={eventData.title}
      />
      <div className="bg-secondary rounded mx-2">
        <div className="d-flex justify-content-center align-items-center p-2">
          <QrReader
            facingMode={"environment"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </>
  );
}
