import { useContext } from 'react'

import { CheckoutContext } from '@/contexts/CheckoutContext'

const useCheckout = () => {
  const context = useContext(CheckoutContext)

  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }

  return context
}

export default useCheckout
