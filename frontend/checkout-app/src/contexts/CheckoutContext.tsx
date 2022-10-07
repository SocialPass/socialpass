import { createContext, useState } from 'react'
import { CheckoutApi } from '@/services/api'
import { Checkout, CheckoutContextType, CheckoutError } from '@/types/Checkout'

export const CheckoutContext = createContext<CheckoutContextType>({
  checkout: null,
  getCheckout: () => new Promise(() => null),
  isLoading: false,
  error: null,
})

export const CheckoutProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [checkout, setEvent] = useState<Checkout | null>(null)
  const [error, setError] = useState<CheckoutError | null>(null)

  const getCheckout = (checkoutPublicId: string) =>
    new Promise((resolve, reject) => {
      setIsLoading(true)
      setError(null)
      setEvent(null)

      CheckoutApi.get(checkoutPublicId)
        .then((response) => {
          setEvent(response.data)
          setIsLoading(false)
          resolve(response.data)
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
          reject(err)
        })
    })

  return (
    <CheckoutContext.Provider
      value={{
        checkout,
        getCheckout,
        isLoading,
        error,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export default CheckoutProvider
