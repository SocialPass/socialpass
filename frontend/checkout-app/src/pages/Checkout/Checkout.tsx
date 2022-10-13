import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import FiatCheckoutOption from './CheckoutOptions/Fiat'
import CrypotCurrencyCheckoutOption from './CheckoutOptions/CryptoCurrency'
import AssetOwnershipCheckoutOption from './CheckoutOptions/AssetOwnership'
import Summary from './Summary'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

export default function Home() {
  const navigate = useNavigate()

  const { event }: any = useEvent()
  const {
    checkout,
    checkoutItems,
    getCheckout,
    getCheckoutItems,
    isLoading,
    isLoadingCheckoutItems,
  }: any = useCheckout()

  const getTotalPrice = () => {
    return checkoutItems.reduce((acc, item) => {
      return acc + item.ticket_tier[checkout.tx_type].price * item.quantity
    }, 0)
  }

  const handleBackClick = () => {
    navigate(`/${event.public_id}`)
  }

  const handleContinueClick = () => {
    navigate('success')
  }

  const getPriceWithCurrencySymbol = (value) => {
    if (checkout?.tx_type === 'tier_fiat') {
      return `$${value}`
    } else if (checkout?.tx_type === 'tier_cryptocurrency') {
      return `${value} ETH`
    }

    return 'N/A'
  }

  useEffect(() => {
    getCheckout()
    getCheckoutItems()
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

            {checkout?.tx_type === 'tier_fiat' ? (
              <FiatCheckoutOption />
            ) : checkout?.tx_type === 'tier_cryptocurrency' ? (
              <CrypotCurrencyCheckoutOption />
            ) : checkout?.tx_type === 'tier_asset_ownership' ? (
              <AssetOwnershipCheckoutOption />
            ) : null}
          </div>
        </div>

        <div className='col-md-5'>
          <div className='px-content pt-md-20 position-md-sticky top-0 start-0'>
            <Summary />

            <form className='mt-20'>
              <input
                type='text'
                name='email'
                className='form-control'
                placeholder='Email Address'
                value={checkout?.email}
                readOnly
              />
              <button
                className='btn btn-secondary btn-lg fsr-6 btn-block mt-15'
                onClick={() => {
                  handleContinueClick()
                }}
              >
                <strong className='antialiased'>Continue</strong>
              </button>
            </form>
            <p>
              <strong>Total Price</strong> &mdash; {getPriceWithCurrencySymbol(getTotalPrice())}
            </p>
            <hr />
            <p className='text-muted fs-base-n2'>
              If you need help placing your order, please{' '}
              <a href='#' className='fw-bold' target='_blank'>
                contact us <i className='fa-regular fa-external-link'></i>
              </a>{' '}
              and let us know
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
