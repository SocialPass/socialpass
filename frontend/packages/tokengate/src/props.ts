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

  web3CheckoutOptions: any
  setWeb3CheckoutOptions: any
  web3CheckoutSelection:any
  setWeb3CheckoutSelection:any

  retrieveJson: any
  setRetrieveJson: any
  retrieveError: any
  setRetrieveError: any

  requestAccessJson: any
  setRequestAccessJson: any
  setRequestAccessError: any
  requestAccessError: any

  grantAccessJson: any
  setGrantAccessJson: any
  grantAccessError: any
  setGrantAccessError: any
}
