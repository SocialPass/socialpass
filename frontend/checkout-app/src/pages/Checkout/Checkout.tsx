import { useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import FiatCheckoutOption from './CheckoutOptions/Fiat'
import CrypotCurrencyCheckoutOption from './CheckoutOptions/CryptoCurrency'
import AssetOwnershipCheckoutOption from './CheckoutOptions/AssetOwnership'
import Summary from './Summary'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

export default function Home() {
  const navigate = useNavigate()

  const { checkoutPublicId } = useParams()

  const { event }: any = useEvent()
  const {
    checkout,
    checkoutItems,
    getCheckout,
    getCheckoutItems,
    isLoading,
    isLoadingCheckoutItems,
  }: any = useCheckout()

  const handleBackClick = () => {
    navigate(`/${event.public_id}`)
  }

  useEffect(() => {
    if (!checkout) getCheckout(checkoutPublicId)
    if (!checkoutItems.length) getCheckoutItems(checkoutPublicId)
  }, [])

  return (
    <>
      <div className='w-100 hs-150 position-relative'>
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img src={event.cover_image} className='w-100 h-auto' alt='Cover image' />
        </div>

        <div className='position-absolute z-1 bottom-0 start-0 px-content py-20'>
          <a
            href='#'
            className='btn btn-rounded ps-5 d-flex align-items-center'
            onClick={() => {
              handleBackClick()
            }}
          >
            <div className='ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center'>
              <i className='fa-regular fa-arrow-left'></i>
            </div>
            <strong className='text-strong antialiased ms-10'>Go Back</strong>
          </a>
        </div>
      </div>

      <div className='px-content pt-20'>
        <p className='text-muted mt-5 mb-0'>By {event.team.theme.brand_name}</p>
        <h2 className='text-strong fs-base-p2 fw-700 m-0'>{event.title}</h2>
      </div>

      <div className='row'>
        <div className='col-md-7'>
          <div className='content mt-20 mb-0 me-md-0'>
            <h1 className='text-strong fw-700 fsr-4 m-0'>Complete Checkout</h1>
            <p className='mt-10'>Please select from one of the checkout options below.</p>
            <h6 className='fw-700 fsr-6 mt-20'>Checkout Options</h6>

            {checkout?.tx_type === 'FIAT' ? (
              <FiatCheckoutOption />
            ) : checkout?.tx_type === 'BLOCKCHAIN' ? (
              <CrypotCurrencyCheckoutOption />
            ) : checkout?.tx_type === 'ASSET_OWNERSHIP' ? (
              <AssetOwnershipCheckoutOption />
            ) : null}
          </div>
        </div>

        <div className='col-md-5'>
          <Summary />
        </div>
      </div>
    </>
  )
}
