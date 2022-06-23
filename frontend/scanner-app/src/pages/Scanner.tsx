/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { FiX } from "react-icons/fi";
import QrReader from "react-qr-reader";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { fetchScanTicket } from "../services/api";

export function Scanner() {
  const [waitingForScan, setWaitingForScan] = useState<Boolean>(false);
  const [qrCode, setQrcode] = useState(null);
  const navigate = useNavigate();
  const { data: eventData, publicId }: any = useEvent();
  const { addToast } = useToast();

  useEffect(() => {
    if(!qrCode){
      return
    }

    setWaitingForScan(true)
    console.log(qrCode);
    fetchScanTicket(publicId, qrCode).then(() => {
      addToast({
        type: "success",
        title: "Succesful Scan",
        description: "",
      });
    }).catch((err_data: any) => {
      addToast({
        type: "error",
        title: "Scan Failed",
        description: err_data.message,
      });
    }).finally(() => {
      setWaitingForScan(false)
    });
  }, [qrCode])

  useEffect(() => {
    if (waitingForScan){
      // render fetching animation
    }
  }, [waitingForScan])

  function handleRedirect() {
    navigate("..");
  }

  const handleScan = (qrcode: any) => {
    if (qrcode) {
      setQrcode(qrcode);
    }
  }

  const handleError = useCallback((err: any) => {
    addToast({
      type: "error",
      title: "QR Reader Error",
      description: "...",
    });
  }, []);

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
        event_attendance={eventData.redemeed_count}
        event_date={eventData.date}
        event_venue={eventData.location}
      />
    </div>
  );
}
