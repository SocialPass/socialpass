import React, { createContext, useState } from "react"
import { TokenGateProviderInterface, GateType } from './props';

interface TokenGateContextInterface {
  id: string // ID of tokengate
  gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
  styles?: any // Styles of tokengate

  step: number // Step of token gate
  setStep: any // Set step of token gate

  json: any //TBD
  setJson: any //TBD
}

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, gateType, styles }:TokenGateProviderInterface) => {
  const [step, setStep] = useState(0);
  const [json, setJson] = useState(null);
  return (
	<TokenGateContext.Provider value={{id, gateType, styles, step, setStep, json, setJson}}>
	  {children}
	</TokenGateContext.Provider>
  );
};
