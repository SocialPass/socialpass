/* eslint-disable eqeqeq */
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>();
  const [eventData, setEventData] = useState<EventDataProps | null>();
  const [eventErrorData, setEventErrorData] = useState<EventErrorProps | null>();
  const [publicId, setPublicId] = useState<String>()

  const params = useParams()

  useEffect(() => {
    if  (!(eventData || eventErrorData)){
      // still loading
      return
    }

    if (eventData) {
      setIsError(false)
    } else {
      setIsError(true)
    }

    setIsLoading(false)

  }, [eventData, eventErrorData])

  useEffect(() => {
    if (!publicId){
      return
    }

    api.get(
      `scanner/landing/${publicId}/`
    ).then((response) => {
      setEventData({...response.data});
    }).catch((err) => {
      if (err.response) {
        setEventErrorData(err.response.data)
      } else {
        setEventErrorData({
          detail: 'unknown-error',
          message: err.message
        })
      }
    });
  }, [publicId])

  function scanTicket(qrcode: any) {
    if (!eventData) {
      return
    }
    return api.post(
      `scanner/scan-ticket/${publicId}/`, {embed_code: qrcode}
    ).then((response) => {
      setEventData({
        ...eventData,
        ticket_count: response.data.ticket_count,
        redemeed_count: response.data.redemeed_count
      })
    }).catch((err) => {
      if (err.response) {
        throw err.response.data
      } else {
        throw {
          detail: 'unknown-error',
          message: err.message
        }
      }
    })
  }

  return (
    <EventContext.Provider
      value={{
        scanTicket,
        eventData,
        setEventData,
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
