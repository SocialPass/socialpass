/* eslint-disable eqeqeq */
import React, { createContext, useContext, useState } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";

const TicketContext = createContext({});

type EventDataProps = {
  event_name: String;
  event_attendance: String;
  event_date: String;
  event_venue: String;
};

const TicketProvider = ({ children }: any) => {
  const { addToast } = useToast();
  const [scanFlag, setScanFlag] = useState<String>("");
  const [eventData, setEventData] = useState<EventDataProps>({
    event_name: "Event Name",
    event_attendance: "30",
    event_date: "2022-12-12T22:30:00Z",
    event_venue: "The Ritz Carlton - South Beach",
  });
  const [statusEvent, setStatusEvent] = useState<String>("");
  const [loading, setLoading] = useState<Boolean>(false);
  const [attendeesAmount, setAttendeesAmount] = useState<number>(() => {
    const attendees = localStorage.getItem("@attendeesAmount");
    if (attendees == null || attendees == undefined) {
      return 0;
    }
    return Number(attendees);
  });

  function increaseAttendeesAmount() {
    setAttendeesAmount(
      (prevAttendeesAmount: number) => prevAttendeesAmount + 1
    );

    let value = Number(localStorage.getItem("@attendeesAmount"));
    localStorage.setItem("@attendeesAmount", (++value).toString());
  }

  async function fetchTicket(qrcode: any) {
    try {
      const response = await api.post("/ticketToken/success", qrcode);
      setScanFlag(response.data);
      if (response.data.status == "success") {
        increaseAttendeesAmount();
      }
      addToast({
        type: "success",
        title: "scan success",
        description: "",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "scan failed",
        description: "",
      });
    }
  }

  // function syncDelay(milliseconds: number) {
  //   let start = new Date().getTime();
  //   let end = 0;
  //   while (end - start < milliseconds) {
  //     end = new Date().getTime();
  //   }
  // }

  return (
    <TicketContext.Provider
      value={{
        fetchTicket,
        scanFlag,
        setScanFlag,
        statusEvent,
        eventData,
        setEventData,
        loading,
        setLoading,
        setStatusEvent,
        attendeesAmount,
        setAttendeesAmount,
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
