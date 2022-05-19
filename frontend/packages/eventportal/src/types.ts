/*
Context types
*/
// Intial Props for EventPortal component
export interface EventPortalProviderInterface {
	id: string
  children?: any
  styles?:any
}

// Props for EventPortal component context
export interface EventPortalContextInterface {
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
