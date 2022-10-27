import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

import { CheckoutApi } from '@/services/api'

export default function TransactionValidation() {
  const { checkoutPublicId } = useParams()
  const navigate = useNavigate()

  const { event }: any = useEvent()
  const { checkout, getCheckout }: any = useCheckout()

  const getTransactionStatus = () => {
    CheckoutApi.getConfirmation(checkout?.public_id).then((response) => {
      if (response.data.tx_status === 'SUCCESS' || response.data.tx_status === 'FULFILLED') {
        navigate(`/${checkout.event}/checkout/${checkout.public_id}/success`)
      } else if (response.data.tx_status === 'FAILED') {
        navigate(`/${checkout.event}/checkout/${checkout.public_id}`)
      }
    })
  }

  const pollTransactionStatus = () => {
    const timer = setInterval(() => {
      getTransactionStatus()
    }, 2000)

    return timer
  }

  useEffect(() => {
    let interval

    if (!checkout) {
      getCheckout(checkoutPublicId)
    } else {
      interval = pollTransactionStatus()
    }

    return () => clearInterval(interval)
  }, [checkout])

  return (
    <>
      <div className='w-100 hs-200 position-relative'>
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img src={event.cover_image} className='w-100 h-auto' alt='Cover image'></img>
        </div>

        <div className='position-absolute z-1 top-100 start-50 translate-middle px-content'>
          <div className='ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden bg-gray-very-light-lm bg-darkgray-very-dim-dm'>
            <img src={event.team.image} className='d-block w-100 h-auto' alt='Team image'></img>
          </div>
        </div>
      </div>

      <div className='px-content pt-20'>
        <p className='text-muted mt-5 mb-0'>By {event?.team.name}</p>
        <h2 className='text-strong fs-base-p2 fw-700 m-0'>{event?.title}</h2>
      </div>

      <div className='row'>
        <div className='text-center mt-50'>
          <div className='spinner-border text-primary text-center' role='status' />
        </div>

        <div className='text-center'>
          <p className='text-muted mt-5 mb-0'>Please wait, we are validating your transaction...</p>
        </div>
      </div>
    </>
  )
}
