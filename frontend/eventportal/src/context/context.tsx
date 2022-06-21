import { createContext, useEffect, useState } from "react";
import { TicketedEventRetrieve } from "../api";
import { EventPortalContextInterface } from "../types";

export const EventPortalContext = createContext<EventPortalContextInterface>(
  {} as EventPortalContextInterface
);

export const EventPortalProvider = ({ children }: { children: any }) => {
  const [id, setID] = useState(
    window.location.pathname.split("/")[1]
      ? window.location.pathname.split("/")[1]
      : ""
  );

  const [retrieveJson, setRetrieveJson] = useState(null);
  const [retrieveError, setRetrieveError] = useState(null);

  const [requestAccessJson, setRequestAccessJson] = useState(null);
  const [requestAccessError, setRequestAccessError] = useState(null);

  const [grantAccessJson, setGrantAccessJson] = useState(null);
  const [grantAccessError, setGrantAccessError] = useState(null);

  const [generalAdmissionSelect, setGeneralAdmissionSelect] = useState(1);

  const [web3CheckoutSelection, setWeb3CheckoutSelection] = useState([]);
  const [eventStatusCheckout, setEventStatusCheckout] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (id !== "/") {
        const response = await TicketedEventRetrieve.call({ public_id: id });

        if (response && response.httpStatus) {
          if (response.httpStatus === 200) {
            setRetrieveJson(response);
          }
          // error
          else {
            setRetrieveError(response);
          }
        }
      }
    }
    fetchEvent();
  }, []);

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
