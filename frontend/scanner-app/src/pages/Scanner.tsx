import React, { useCallback, useState } from "react";
import { Header } from "../components/Header";
import QrReader from "react-qr-reader";

export function Scanner() {
  const [facingModeState, setFacingModeState] = useState<String>("user");
  const [scanFlag, setScanFlag] = useState<String>("");

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

  const handleScan = useCallback(async (qrcode: any) => {
    if (qrcode) {
      fetchTicket(qrcode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchTicket(qrcode: any) {
    console.log(qrcode);
    setScanFlag("success");
  }

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
      {scanFlag === "success" && (
        <div
          className="modal fade"
          id="exampleModal"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <div className="alert alert-success" role="alert">
            Success scan!
          </div>
        </div>
      )}
      {scanFlag === "denied" && (
        <div className="alert alert-danger" role="alert">
          Error scan!
        </div>
      )}
      {facingModeState === "user" ? (
        <div className="mb-2">
          <QrReader
            facingMode={"user"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
          />
        </div>
      ) : (
        <div className="mb-2">
          <QrReader
            facingMode={"environment"}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "50%", height: "50%" }}
          />
        </div>
      )}
      {facingModeState}
      <br />
      <button onClick={handleChangeCamera}>change camera</button>
    </>
  );
}
