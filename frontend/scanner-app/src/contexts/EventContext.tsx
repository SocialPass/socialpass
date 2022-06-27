/* eslint-disable eqeqeq */
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchEvent, fetchScanTicket } from "../services/api";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

const EventContext = createContext({});

type EventDataProps = {
  title: String;
  date: String;
  location: String;
  capacity: number;
  ticket_count: number;
  redeemed_count: number;
};

type EventErrorProps = {
  detail: String;
  message: String;
};

const EventProvider = ({ children }: any) => {
  const [publicId, setPublicId] = useState<String>();
  const [eventData, setEventData] = useState<EventDataProps>();
  const { status, isLoading, isError, error, data, refetch } = useQuery(
    ["fetchEvent", publicId],
    () => fetchEvent(publicId),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (publicId) {
      refetch();
    }
  }, [publicId]);

  useEffect(() => {
    setEventData(data);
  }, [data]);

  return (
    <EventContext.Provider
      value={{
        publicId,
        setPublicId,
        status,
        isLoading,
        isError,
        eventData,
        setEventData,
        error,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

function useEvent() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvent must be used within a EventProvider");
  }

  return context;
}

export { EventProvider, useEvent };
