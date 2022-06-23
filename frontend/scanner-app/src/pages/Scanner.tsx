/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { FiX } from "react-icons/fi";
import QrReader from "react-qr-reader";
import { useEvent } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { fetchScanTicket } from "../services/api";
import { ProgressBar } from "react-bootstrap";


type ScanFailureBlockProps = {
  active: boolean,
  intervalId: any,
  progress: number
}

export function Scanner() {
  const [waitingForScan, setWaitingForScan] = useState<Boolean>(false);
  const [qrCode, setQrcode] = useState(null);
  const navigate = useNavigate();
  const { data: eventData, publicId }: any = useEvent();
  const { addToast, clearToasts } = useToast();
  const initialScanFailureBlock = {active: false, intervalId: undefined, progress: 0}
  const [scanFailureBlock, setScanFailureBlock] = useState<ScanFailureBlockProps>(
    {active: false, intervalId: undefined, progress: 0}
  )
  const [elapsedTime, setElapsedTime] = useState(0)

  const PROGRESS_TIME_IN_MS = 3000
  const STEP_TIME_IN_MS = 5
  const MAX_PROGRESS = 110

  useEffect(() => {
    setScanFailureBlock({
      ...initialScanFailureBlock,
      active: false
    })

    if(!qrCode){
      return
    }

    setWaitingForScan(true)
    clearToasts();
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
        description: err_data?.message,
      });
      setScanFailureBlock({
        ...initialScanFailureBlock,
        active: true
      })
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

  useEffect(() => {
    let scannerContainer = document.getElementById("qr-scanner-container")
    if (!scannerContainer){
      return
    }
    scannerContainer.firstChild.firstChild.style.position = ''
  })

  const handleError = useCallback((err: any) => {
    addToast({
      type: "error",
      title: "QR Reader Error",
      description: "...",
    });
  }, []);

  useEffect(() => {
    console.log(scanFailureBlock)
    if (!scanFailureBlock.active){
      console.log("Clear interval")
      if (scanFailureBlock.intervalId){
        clearInterval(scanFailureBlock.intervalId)
      }
      setScanFailureBlock(
        initialScanFailureBlock
      )
      setElapsedTime(0)
      return
    }
    console.log(scanFailureBlock)

    scanFailureBlock.intervalId = setInterval(() => {
      setElapsedTime(t => t + STEP_TIME_IN_MS)
    }, STEP_TIME_IN_MS);

    return () => clearInterval(scanFailureBlock.intervalId);
  }, [scanFailureBlock.active])

  useEffect(() =>{
    if (!scanFailureBlock.active){
      return
    }

    if (elapsedTime < PROGRESS_TIME_IN_MS) {
      console.log("ticking")
      setScanFailureBlock({
        ...scanFailureBlock,
        progress: elapsedTime / PROGRESS_TIME_IN_MS * MAX_PROGRESS
      })
    } else {
      console.log("reached max progress")
      setScanFailureBlock({
        ...initialScanFailureBlock,
        active: false
      })
      setQrcode(null)
    }
  }, [elapsedTime])

  console.log(scanFailureBlock)

  return (
    <div className="scanner-body d-flex flex-column">
        <div className="btn-close" style={{position: "absolute", "zIndex": 1000}}>
            <FiX onClick={handleRedirect} size={26} />
        </div>
      <button onClick={e => handleScan(e.target.innerText)}>6fc9f02e-fb72-4073-ac03-2109e2ae8ab8</button>
      <div id="qr-scanner-container" className="flex-grow-1">
        <QrReader
          facingMode={"environment"}
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{height: "100%", overflow:"visible", position:"relative"}}
        />
        <div style={{position: 'relative', height: '0px'}}>
          <ProgressBar className={scanFailureBlock.active ? "" : "d-none" + " "}
                       now={scanFailureBlock.progress}
                       variant="danger"
                       style={{position: "absolute", bottom: "-1px", width: "100%"}}
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
