import React, { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";

const TicketContext = createContext({});

const TicketProvider = ({ children }: any) => {
  const { addToast } = useToast();
  const [scanFlag, setScanFlag] = useState<String>("");

  function fetchTicket(qrcode: any) {
    console.log(qrcode);
    setScanFlag("success");
    addToast({
      type: "error",
      title: "scan error",
      description: "scan again",
    });
  }

  return (
    <TicketContext.Provider
      value={{
        fetchTicket,
        scanFlag,
        setScanFlag,
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
