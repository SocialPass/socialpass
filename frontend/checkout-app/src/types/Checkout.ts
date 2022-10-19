export type Checkout = {
  public_id: string
  name: string
  email: string
}

type GetCheckout = (checkoutPublicId: string) => Promise<Event | unknown>

export type CheckoutError = {
  detail: string
  message: string
}

export type CheckoutContextType = {
  checkout: Checkout | null
  getCheckout: GetCheckout | null
  isLoading: boolean
  error: CheckoutError | null
}
