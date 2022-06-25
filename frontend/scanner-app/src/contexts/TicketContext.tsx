/* eslint-disable eqeqeq */
import React, { createContext, useContext, useState } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";

const TicketContext = createContext({});

type EventDataProps = {
  title: String;
  date: String;
  location: String;
  capacity: number;
  ticket_count: number;
  redemeed_count: number;
  redemption_code: String;
};

const TicketProvider = ({ children }: any) => {
  const { addToast } = useToast();
  const [scanFlag, setScanFlag] = useState<String>("");
  const [eventData, setEventData] = useState<EventDataProps>();
  const [previousScannedCode, setPreviousScannedCode] = useState<String>("");

  async function scanTicket(qrcode: any) {
    if (!eventData) {
      return
    }
    if (qrcode == previousScannedCode) {
      return
    }
    setPreviousScannedCode(qrcode);
    api.post(
      `scanner/scan-ticket/${eventData?.redemption_code}/`, {embed_code: qrcode}
    ).then((response) => {
      setEventData({
        ...eventData,
        ticket_count: response.data.ticket_count,
        redemeed_count: response.data.redemeed_count
      });
      addToast({
        type: "success",
        title: "Succesful Scan",
        description: "",
      });
    }).catch((error) => {
      addToast({
        type: "error",
        title: "Scan Failed",
        description: error?.response.data.message,
      });
    });
  }

  return (
    <TicketContext.Provider
      value={{
        scanTicket,
        scanFlag,
        setScanFlag,
        eventData,
        setEventData,
        bustEventDataCache
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

function useTicket() {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error("useTicket must be used within a TicketProvider");
  }

  return context;
}

export { TicketProvider, useTicket };
