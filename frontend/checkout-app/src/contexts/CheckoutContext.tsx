import { createContext, useState } from 'react'
import { CheckoutApi } from '@/services/api'
import { Checkout, CheckoutContextType, CheckoutError } from '@/types/Checkout'
import { CheckoutItem } from '@/types/CheckoutItem'

export const CheckoutContext = createContext<CheckoutContextType>({
  checkout: null,
  getCheckout: () => new Promise(() => null),
  isLoading: false,
  error: null,
})

export const CheckoutProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingCheckoutItems, setIsLoadingCheckoutItems] = useState<boolean>(false)
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([])
  const [error, setError] = useState<CheckoutError | null>(null)

  const getTotalPrice = () =>
    checkoutItems.reduce(
      (acc, ticketTier) => acc + ticketTier?.quantity * ticketTier?.ticket_tier?.price || 0,
      0,
    )

  // Communicating between what backend (left) and frontend (right) understands as transaction type
  const getTxType = (type) =>
    ({
      FIAT: 'tx_fiat',
      BLOCKCHAIN: 'tx_cryptocurrency',
      ASSET_OWNERSHIP: 'tx_asset_ownership',
    }[type])

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

  const getCheckoutItems = (checkoutPublicId: string) =>
    new Promise((resolve, reject) => {
      setIsLoadingCheckoutItems(true)
      setError(null)
      setCheckoutItems([])

      CheckoutApi.getItems(checkoutPublicId)
        .then((response) => {
          setCheckoutItems(response.data)
          setIsLoadingCheckoutItems(false)
          resolve(response.data)
        })
        .catch((err) => {
          setError(err)
          setIsLoadingCheckoutItems(false)
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
        name: checkout?.name,
        checkout_items: checkoutItems.map((item) => ({
          ...item,
          ticket_tier: item.ticket_tier.public_id,
        })),
        cost: getTotalPrice(),
      }
      // Creates checkout if there isn't one
      if (!checkout?.public_id) {
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
      } else {
        // Edit checkout on backend
        CheckoutApi.edit(checkout?.public_id, data)
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
      }
    })

  const pay = (data) =>
    new Promise((resolve, reject) => {
      CheckoutApi.pay(checkout?.public_id, data)
        .then((response) => {
          setCheckout({
            ...checkout,
            tx_status: 'PROCESSING',
            [getTxType(checkout?.tx_type)]: response.data,
          })

          resolve(response.data)
        })
        .catch((err) => {
          setError(err)
          reject(err)
        })
    })

  return (
    <CheckoutContext.Provider
      value={{
        checkout,
        checkoutItems,
        getCheckout,
        setCheckout,
        getCheckoutItems,
        setCheckoutItems,
        saveCheckout,
        getTxType,
        pay,
        isLoading,
        isLoadingCheckoutItems,
        error,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export default CheckoutProvider
