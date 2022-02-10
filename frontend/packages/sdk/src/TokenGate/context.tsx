import React, { createContext, useState } from "react"
import { TokenGateContextInterface, TokenGateProviderInterface } from './props';

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, gateType }:TokenGateProviderInterface) => {
  const [step, setStep] = useState(0);
  const [json, setJson] = useState(0);
  return (
	<TokenGateContext.Provider value={{step, setStep, json, setJson, id, gateType}}>
	  {children}
	</TokenGateContext.Provider>
  );
};
