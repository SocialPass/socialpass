import { useContext } from 'react'
import { CheckoutPortalContext } from '../context'
import CheckoutSuccessPage from '../components/CheckoutSuccessPage'
import CheckoutFailedPage from '../components/CheckoutFailedPage'

export const CheckoutStatus = () => {
  const { grantAccessJson } = useContext(CheckoutPortalContext)

<<<<<<< HEAD
  if (!grantAccessJson) {
    return <CheckoutSuccessPage />;
=======
  if (grantAccessJson) {
    return <CheckoutSuccessPage />
>>>>>>> 4920ef621a88322afd6c777d8a2b9b0b87c7afac
  }
  return <CheckoutFailedPage />
}
