import React, { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";

const TicketContext = createContext({});

const TicketProvider = ({ children }: any) => {
  const { addToast } = useToast();
  const [scanFlag, setScanFlag] = useState<String>("");
  const [statusEvent, setStatusEvent] = useState<String>("");

  const eventData = {
    total: 750,
    attendees: 212,
    title: "Event title",
  };

  function fetchTicket(qrcode: any) {
    console.log(qrcode);
    setScanFlag("success");
    addToast({
      type: "success",
      title: "scan success",
      description: "",
    });
    setStatusEvent("reached");
  }

  return (
    <TicketContext.Provider
      value={{
        fetchTicket,
        scanFlag,
        setScanFlag,
        eventData,
        statusEvent,
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
