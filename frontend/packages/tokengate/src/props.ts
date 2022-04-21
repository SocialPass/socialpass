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
  // base
  id: string
  styles?: any

  // retrieve gate
  retrieveJson: any
  setRetrieveJson: any
  retrieveError: any
  setRetrieveError: any

  // request access gate
  requestAccessJson: any
  setRequestAccessJson: any
  requestAccessError: any
  setRequestAccessError: any

  // grant access gate
  grantAccessJson: any
  setGrantAccessJson: any
  grantAccessError: any
  setGrantAccessError: any

  // checkout
  web3CheckoutSelection:any
  setWeb3CheckoutSelection:any
}
