import React, { createContext, useState } from "react"
import { TokenGateProviderInterface, TokenGateContextInterface, GateType } from './props';

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, styles }:TokenGateProviderInterface) => {
  const [step, setStep] = useState(0);
  const [json, setJson] = useState(null);
  return (
	<TokenGateContext.Provider value={{id, styles, step, setStep, json, setJson}}>
	  {children}
	</TokenGateContext.Provider>
  );
};
