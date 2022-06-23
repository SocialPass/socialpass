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
  redemeed_count: number;
};

type EventErrorProps = {
  detail: String;
  message: String
}

const EventProvider = ({ children }: any) => {
  const [publicId, setPublicId] = useState<String>()
  const { status, isLoading, isError, error, data, refetch } = useQuery(
    ['fetchEvent', publicId],
    () => fetchEvent(publicId),
    {
      enabled: false
    }
  )

  useEffect(() => {
    if (publicId){
      refetch()
    }
  }, [publicId])

  return (
    <EventContext.Provider
      value={{
        data,
        status,
        isLoading,
        isError,
        publicId,
        setPublicId
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
