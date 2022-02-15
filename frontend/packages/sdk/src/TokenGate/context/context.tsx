import React, { createContext, useState } from "react"
import { TokenGateProviderInterface, TokenGateContextInterface, GateType } from '../props';

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, styles }:TokenGateProviderInterface) => {
  const [step, setStep] = useState(0);
  const [json, setJson] = useState(null);
  const [httpStatus, setHttpStatus] = useState(0);
  return (
	<TokenGateContext.Provider value={{id, styles, step, setStep, json, setJson, httpStatus, setHttpStatus}}>
	  {children}
	</TokenGateContext.Provider>
  );
};
