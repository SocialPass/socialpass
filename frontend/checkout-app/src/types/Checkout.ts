export type Checkout = {
  public_id?
  name?
  email?
  tx_type?
  tx_status?
  tier_fiat?
  tier_cryptocurrency?
  tier_asset_ownership?
}

type GetCheckout = (checkoutPublicId: string) => Promise<Event | unknown>

export type CheckoutError = {
  detail: string
  message: string
}

export type CheckoutContextType = {
  checkout?: Checkout | null
  checkoutItems?
  getCheckout?: GetCheckout | null
  setCheckout?
  getCheckoutItems?
  setCheckoutItems?
  saveCheckout?
  getTxType?
  pay?
  isLoading?
  isLoadingCheckoutItems?
  error?
}
