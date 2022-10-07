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
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [checkoutItems, setCheckoutItems] = useState([])
  const [paymentType, setPaymentType] = useState(null)
  const [error, setError] = useState<CheckoutError | null>(null)

  const getCheckout = (checkoutPublicId: string) =>
    new Promise((resolve, reject) => {
      setIsLoading(true)
      setError(null)
      setCheckout(null)

      CheckoutApi.get(checkoutPublicId)
        .then((response) => {
          setCheckout(response.data)
          setIsLoading(false)
          resolve(response.data)
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
          reject(err)
        })
    })

  const saveCheckout = () =>
    new Promise((resolve, reject) => {
      setIsLoading(true)
      setError(null)
      setCheckout(null)

      const data = {
        ...checkout,
        checkoutItems,
      }

      CheckoutApi.create(data)
        .then((response) => {
          setCheckout(response.data)
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
        checkoutItems,
        paymentType,
        getCheckout,
        setPaymentType,
        setCheckoutItems,
        saveCheckout,
        isLoading,
        error,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export default CheckoutProvider
