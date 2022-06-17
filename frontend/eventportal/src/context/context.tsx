import { createContext, useState } from "react";
import { CheckoutPortalContextInterface } from "../types";

export const CheckoutPortalContext = createContext<CheckoutPortalContextInterface>(
  {} as CheckoutPortalContextInterface
);

export const CheckoutPortalProvider = ({ children }: { children: any }) => {
  const [id, setID] = useState(() => {
    const data = localStorage.getItem("@eventId");
    if (data == null) {
      return "";
    }
    return JSON.parse(data);
  });
  const [retrieveJson, setRetrieveJson] = useState(() => {
    const data = localStorage.getItem("@retrieveJson");
    if (data == null) {
      return null;
    }
    return JSON.parse(data);
  });
  const [retrieveError, setRetrieveError] = useState(null);

  const [requestAccessJson, setRequestAccessJson] = useState(null);
  const [requestAccessError, setRequestAccessError] = useState(null);

  const [grantAccessJson, setGrantAccessJson] = useState(null);
  const [grantAccessError, setGrantAccessError] = useState(null);

  const [generalAdmissionSelect, setGeneralAdmissionSelect] = useState(1);

  const [web3CheckoutSelection, setWeb3CheckoutSelection] = useState([]);
  const [eventStatusCheckout, setEventStatusCheckout] = useState(true);

  return (
    <CheckoutPortalContext.Provider
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
    </CheckoutPortalContext.Provider>
  );
};
