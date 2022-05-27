import React, { createContext, useContext, useState } from "react";

const TicketContext = createContext({});

const TicketProvider = ({ children }: any) => {
  const [scanFlag, setScanFlag] = useState<String>("");
  const [statusEvent, setStatusEvent] = useState<String>("");

  const eventData = [
    {
      name: 'Event Name',
      attendance: '750',
      date: '2022-12-12T22:30:00Z',
      venue: 'The Ritz Carlton - South Beach',
    }
  ];



  return (
    <TicketContext.Provider
      value={{
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