// Props for EventPortal component context
export interface EventPortalContextInterface {
  // base
  id: string
  setID: any

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

  eventStatusCheckout:Boolean,
  setEventStatusCheckout:any,

  generalAdmissionSelect:any,
  setGeneralAdmissionSelect:any
}
