import React, { createContext, useState } from "react"
import { TokenGateProviderInterface, TokenGateContextInterface } from '../props';

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, styles }:TokenGateProviderInterface) => {
  const [gateType, setGateType] = useState(null);
  const [checkoutSelection, setCheckoutSelection ] = useState(null);

  const [retrieveJson, setRetrieveJson] = useState(null);
  const [retrieveError, setRetrieveError] = useState(null);

  const [requestAccessJson, setRequestAccessJson] = useState(null);
  const [setRequestAccessError, requestAccessError] = useState(null);

  const [grantAccessJson, setGrantAccessJson] = useState(null);
  const [grantAccessError, setGrantAccessError] = useState(null);

  return (
	<TokenGateContext.Provider value={{
    id,
    styles,
    setGateType,
    gateType,
    checkoutSelection,
    setCheckoutSelection,
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
  }}>
	  {children}
	</TokenGateContext.Provider>
  );
};
