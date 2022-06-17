// Props for CheckoutPortal component context
export interface CheckoutPortalContextInterface {
  // base
  id: string
  setID: any

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
