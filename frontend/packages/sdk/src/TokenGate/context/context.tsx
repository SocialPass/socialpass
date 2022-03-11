import React, { createContext, useState } from "react"
import { TokenGateProviderInterface, TokenGateContextInterface } from '../props';

export const TokenGateContext = createContext<TokenGateContextInterface>({} as TokenGateContextInterface);

export const TokenGateProvider = ({ children, id, styles }:TokenGateProviderInterface) => {
  const [step, setStep] = useState(0);

  const [json, setJson] = useState(null);
  const [httpStatus, setHttpStatus] = useState(0);

  const [json2, setJson2] = useState(null);
  const [httpStatus2, setHttpStatus2] = useState(0);
  const [gateType, setGateType] = useState(null);

  return (
	<TokenGateContext.Provider value={{
    id,
    setGateType,
    gateType,
    styles,
    step,
    setStep,
    json,
    setJson,
    httpStatus,
    setHttpStatus,
    json2,
    setJson2,
    httpStatus2,
    setHttpStatus2
  }}>
	  {children}
	</TokenGateContext.Provider>
  );
};
