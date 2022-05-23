import React, { useCallback, useState } from "react";
import { Header } from "../components/Header";
import QrReader from "react-qr-reader";
import { useTicket } from "../contexts/TicketContext";

export function Scanner() {
  const [facingModeState, setFacingModeState] = useState<String>("user");
  const { fetchTicket }: any = useTicket();

  const eventData = {
    total: 750,
    attendees: 212,
    title: "Event title",
  };

  function handleChangeCamera() {
    if (facingModeState === "user") {
      setFacingModeState("environment");
    } else {
      setFacingModeState("user");
    }
  }

  const handleScan = useCallback(
    async (qrcode: any) => {
      if (qrcode) {
        fetchTicket(qrcode);
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
      {/* {scanFlag === "success" && (
        <div className="alert alert-success" role="alert">
          Success scan!
        </div>
      )}
      {scanFlag === "denied" && (
        <div className="alert alert-danger" role="alert">
          Error scan!
        </div>
      )} */}
      {facingModeState === "user" ? (
        <div className="d-flex justify-content-center align-items-center mb-2">
          <QrReader
            facingMode={"user"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "80%", height: "80%" }}
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center mb-2">
          <QrReader
            facingMode={"environment"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "80%", height: "80%" }}
          />
        </div>
      )}
      {facingModeState}
      <br />
      <button onClick={handleChangeCamera}>change camera</button>
    </>
  );
}
