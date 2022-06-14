import { createContext, useState } from "react";
import { EventPortalContextInterface } from "../types";

export const EventPortalContext = createContext<EventPortalContextInterface>(
  {} as EventPortalContextInterface
);

export const EventPortalProvider = ({ children }: { children: any }) => {
  const [id, setID] = useState('');
  const [retrieveJson, setRetrieveJson] = useState(null);
  const [retrieveError, setRetrieveError] = useState(null);

  const [requestAccessJson, setRequestAccessJson] = useState(null);
  const [requestAccessError, setRequestAccessError] = useState(null);

  const [grantAccessJson, setGrantAccessJson] = useState(null);
  const [grantAccessError, setGrantAccessError] = useState(null);

  const [generalAdmissionSelect, setGeneralAdmissionSelect] = useState(1);

  const [web3CheckoutSelection, setWeb3CheckoutSelection] = useState([]);
  const [eventStatusCheckout, setEventStatusCheckout] = useState(true);

  return (
    <EventPortalContext.Provider
      value={{
        id,
        setID,

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

        generalAdmissionSelect,
        setGeneralAdmissionSelect,
      }}
    >
      {children}
    </EventPortalContext.Provider>
  );
};
