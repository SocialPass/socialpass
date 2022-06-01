import React, { createContext, useState } from "react";
import { EventPortalContextInterface } from "../types";

export const EventPortalContext = createContext<EventPortalContextInterface>(
  {} as EventPortalContextInterface
);

export const EventPortalProvider = ({ children }: { children: any }) => {
  const [id, setID] = useState("");
  const [backButton, setBackButton] = useState(null);
  const [retrieveJson, setRetrieveJson] = useState(null);
  const [retrieveError, setRetrieveError] = useState(null);

  const [requestAccessJson, setRequestAccessJson] = useState(null);
  const [requestAccessError, setRequestAccessError] = useState(null);

  const [grantAccessJson, setGrantAccessJson] = useState(null);
  const [grantAccessError, setGrantAccessError] = useState(null);

  const [web3CheckoutSelection, setWeb3CheckoutSelection] = useState([]);
  const [eventStatusCheckout, setEventStatusCheckout] = useState(true);

  return (
    <EventPortalContext.Provider
      value={{
        id,
        setID,
        backButton,
        setBackButton,

        web3CheckoutSelection,
        setWeb3CheckoutSelection,

        retrieveJson,
        setRetrieveJson,
        retrieveError,
        setRetrieveError,

        requestAccessJson,
        setRequestAccessJson,
        setRequestAccessError,
        requestAccessError,

        grantAccessJson,
        setGrantAccessJson,
        grantAccessError,
        setGrantAccessError,

        eventStatusCheckout,
        setEventStatusCheckout,
      }}
    >
      {children}
    </EventPortalContext.Provider>
  );
};
