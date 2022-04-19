/*
steps
0: Initial
1: Wallet Connected, Prompt for Signature
2: Success (After signature)
3. Failure (After Signature)
*/
export enum GateType {
  TICKET = "TICKET",
  AIRDROP = "AIRDROP",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
  LOADING = "LOADING"
}

/*
Context types
*/
// Intial Props for TokenGate component
export interface TokenGateProviderInterface {
	id: string
  children?: any
  styles?:any
}

// Props for TokenGate component context
export interface TokenGateContextInterface {
  id: string
  styles?: any
  gateType: any
  setGateType: any
  checkoutSelection:any
  setCheckoutSelection:any

  retrieveJson: any
  setRetrieveJson: any
  retrieveError: any
  setRetrieveError: any

  requestAccessJson: any
  setRequestAccessJson: any
  setRequestAccessError: any
  requestAccessError: any

  grantAccessJson: any
  setgGrantAccessJson: any
  grantAccessError: any
  setGrantAccessError: any
}
