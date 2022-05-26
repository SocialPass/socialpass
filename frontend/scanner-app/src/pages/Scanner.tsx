/* eslint-disable eqeqeq */
import React, { useCallback, useEffect } from "react";
import { Header } from "../components/Header";
import QrReader from "react-qr-reader";
import { useTicket } from "../contexts/TicketContext";
import { useNavigate } from "react-router-dom";

export function Scanner() {
  const {
    fetchTicket,
    eventData,
    attendeesAmount,
    loading,
    setStatusEvent,
  }: any = useTicket();
  const navigate = useNavigate();

  const handleScan = useCallback(
    async (qrcode: any) => {
      if (qrcode) {
        fetchTicket(qrcode);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    function verifyAttendeesAmount() {
      console.log(eventData.event_attendance);
      console.log(attendeesAmount);
      if (attendeesAmount >= Number(eventData.event_attendance)) {
        setStatusEvent("reached");
        navigate("/end-event");
      }
    }
    verifyAttendeesAmount();
  }, [attendeesAmount, eventData.event_attendance, navigate, setStatusEvent]);

  const handleError = useCallback((err: any) => {
    console.log(err);
  }, []);

  return (
    <>
      {loading ? (
        <span>loading...</span>
      ) : (
        <>
          <Header
            total={eventData?.event_attendance}
            attendees={attendeesAmount}
            title={eventData?.event_name}
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
      )}
    </>
  );
}
