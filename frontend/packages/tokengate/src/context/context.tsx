import React, { createContext, useState } from "react"
import { TokenGateProviderInterface, TokenGateContextInterface } from '../props';

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, styles }:TokenGateProviderInterface) => {
  const [retrieveJson, setRetrieveJson] = useState(null);
  const [retrieveError, setRetrieveError] = useState(null);

  const [requestAccessJson, setRequestAccessJson] = useState(null);
  const [requestAccessError, setRequestAccessError] = useState(null);

  const [grantAccessJson, setGrantAccessJson] = useState(null);
  const [grantAccessError, setGrantAccessError] = useState(null);

  const [web3CheckoutSelection, setWeb3CheckoutSelection ] = useState([]);

  return (
	<TokenGateContext.Provider value={{
    id,
    styles,
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
  }}>
	  {children}
	</TokenGateContext.Provider>
  );
};
