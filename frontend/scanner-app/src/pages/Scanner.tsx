/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { FiX } from "react-icons/fi";
import QrReader from "react-qr-reader";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { fetchScanTicket } from "../services/api";
import HashLoader from "react-spinners/HashLoader";

export function Scanner() {
  const [waitingForScan, setWaitingForScan] = useState<Boolean>(false);
  const [qrCode, setQrcode] = useState(null);
  const navigate = useNavigate();
  const { data: eventData, publicId }: any = useEvent();
  const { addToast } = useToast();

  useEffect(() => {
    if (!qrCode) {
      return;
    }

    setWaitingForScan(true);
    console.log(qrCode);
    fetchScanTicket(publicId, qrCode)
      .then(() => {
        addToast({
          type: "success",
          title: "Succesful Scan",
          description: "",
        });
      })
      .catch((err_data: any) => {
        addToast({
          type: "error",
          title: "Scan Failed",
          description: err_data?.message,
        });
      })
      .finally(() => {
        setWaitingForScan(false);
      });
  }, [qrCode]);

  // useEffect(() => {
  //   if (waitingForScan) {
  //     // render fetching animation
  //   }
  // }, [waitingForScan]);

  function handleRedirect() {
    navigate("..");
  }

  const handleScan = (qrcode: any) => {
    if (qrcode) {
      setQrcode(qrcode);
    }
  };

  useEffect(() => {
    let scannerContainer = document.getElementById("qr-scanner-container");
    if (!scannerContainer) {
      return;
    }
    scannerContainer.firstChild.firstChild.style.position = "";
  });

  const handleError = useCallback((err: any) => {
    addToast({
      type: "error",
      title: "QR Reader Error",
      description: "...",
    });
  }, []);

  return (
    <div className="scanner-body d-flex flex-column">
      <div className="btn-close" style={{ position: "absolute", zIndex: 1000 }}>
        <FiX onClick={handleRedirect} size={26} />
      </div>
      {/* <button onClick={e => handleScan(e.target.innerText)}>6fc9f02e-fb72-4073-ac03-2109e2ae8ab8</button> */}
      <div id="qr-scanner-container" className="flex-grow-1">
        <QrReader
          facingMode={"environment"}
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{ height: "100%", overflow: "visible", position: "relative" }}
        />
      </div>
      <div className="d-flex flex-row-reverse align-items-center me-10 mt-10">
        {waitingForScan && <HashLoader color="#EF7C4E" size={30} />}
      </div>
      <Footer
        event_name={eventData.title}
        event_attendance={eventData.redemeed_count}
        event_date={eventData.date}
        event_venue={eventData.location}
      />
    </div>
  );
}
