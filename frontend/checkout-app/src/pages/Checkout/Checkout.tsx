import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { useConnect, useAccount, useSignMessage } from 'wagmi'

import FiatCheckoutOption from './CheckoutOptions/Fiat'
import CrypotCurrencyCheckoutOption from './CheckoutOptions/CryptoCurrency'
import AssetOwnershipCheckoutOption from './CheckoutOptions/AssetOwnership'
import Summary from './Summary'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

export default function Home() {
  const navigate = useNavigate()
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false)

  const connectHook = useConnect()
  const accountHook = useAccount()
  const signHook = useSignMessage()

  const { eventPublicId, checkoutPublicId } = useParams()

  const { event }: any = useEvent()
  const {
    checkout,
    getCheckout,
    getCheckoutItems,
    setCheckout,
    setCheckoutItems,
    pay,
    error,
  }: any = useCheckout()

  const handleBackClick = () => {
    navigate(`/${event.public_id}`)
    setCheckout(null)
    setCheckoutItems([])
  }

  const getPaymentData = async () => {
    switch (checkout?.tx_type) {
      case 'FIAT':
        return {}

      case 'BLOCKCHAIN':
        return {}

      case 'ASSET_OWNERSHIP': {
        const signed_message = await signHook.signMessageAsync({
          message: checkout?.tx_asset_ownership?.unsigned_message,
        }).catch(() => {
          setIsCheckoutProcessing(false)
        })
        
        return {
          tx_type: checkout?.tx_type,
          wallet_address: accountHook.address,
          signed_message: signed_message,
        }
      }

      default:
        return null
    }
  }

  const handleContinueClick = async (e) => {
    e.preventDefault()

    setIsCheckoutProcessing(true)
    const paymentData = await getPaymentData()
    
    pay(paymentData)
      .then(() => {
        setIsCheckoutProcessing(false)
        navigate('validation')
      })
      .catch((err) => {
        console.log(err)
        setCheckout({ ...checkout, tx_status: 'FAILED' })
        setIsCheckoutProcessing(false)
      })
  }

  const getErrorMessage = () => {
    if (error) {
      const messages = Object.keys(error).map((e) => error[e][0])

      return `Sorry! ${messages.join('<br />')}`
    }

    return 'Sorry! The transaction has failed. Please try again.'
  }

  useEffect(() => {
    getCheckout(checkoutPublicId).catch(() => {
      navigate(`/${eventPublicId}/checkout/${checkoutPublicId}/error`)
    })

    getCheckoutItems(checkoutPublicId).catch(() => {})
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

      {checkout?.tx_status === 'FAILED' ? (
        <div className='px-content pt-20'>
          <div
            className='alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
            role='alert'
          >
            <i className='fa-regular fa-times me-15'></i>
            <p className='m-0'>{getErrorMessage()}</p>
          </div>
        </div>
      ) : null}

      {signHook.isError ? (
        <div className='px-content pt-20'>
          <div
            className='alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
            role='alert'
          >
            <i className='fa-regular fa-times me-15'></i>
            <p className='m-0'>The signature request was cancelled. Please try again.</p>
          </div>
        </div>
      ) : null}

      {signHook.isLoading ? (
        <div className='px-content pt-20'>
          <div
            className='alert alert-primary m-0 text-info-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
            role='alert'
          >
            <i className='fa-regular fa-times me-15'></i>
            <p className='m-0'>Please complete the request in your wallet provider</p>
          </div>
        </div>
      ) : null}

      <div className='px-content pt-20'>
        <p className='text-muted mt-5 mb-0'>By {event.team.name}</p>
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
              <AssetOwnershipCheckoutOption connectors={connectHook.connectors} />
            ) : null}
          </div>
        </div>

        <div className='col-md-5'>
          <Summary 
            onContinueClick={handleContinueClick} 
            enableContinue={!!accountHook?.address} 
            isCheckoutProcessing={isCheckoutProcessing} 
          />
        </div>
      </div>
    </>
  )
}
