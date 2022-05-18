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

  // navigation
  backButton:any
  setBackButton:any

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
