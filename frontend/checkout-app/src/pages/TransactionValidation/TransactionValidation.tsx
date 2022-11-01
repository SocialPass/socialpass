import { useEffect } from 'react'
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

  const handleBackClick = () => {
    navigate(`/${event.public_id}/checkout/${checkout.public_id}`)
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
      <div className="page-wrapper">
    <div className="content-wrapper ws-820 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column">
        <div>

            <div className="w-100 hs-150 position-relative">
                <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none">
                    <img src={event.cover_image} className="w-100 h-auto" alt="Cover image" />
                </div>

                <div className="position-absolute z-1 bottom-0 start-0 px-content py-20">
                    <a href="#" className="btn btn-rounded ps-5 d-flex align-items-center">
                        <div className="ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center">
                            <i className="fa-regular fa-arrow-left"></i>
                        </div>
                        <strong className="text-strong antialiased ms-10"
                        onClick={() => {
                          handleBackClick()
                        }}>Go Back</strong>
                    </a>
                </div>
            </div>

            <div className="px-content pt-20">
                <p className="text-muted mt-5 mb-0">
                    By SocialPass
                </p>
                <h2 className="text-strong fs-base-p2 fw-700 m-0">
                    NFT Holders Party
                </h2>
            </div>

            <div className="row">
                <div className="col-md-10 col-lg-8 mx-auto">
                    <div className="content mt-50 mb-0">
                        <h1 className="text-strong fw-700 fsr-4 m-0">
                            Processing Checkout ...
                        </h1>
                        <p className="mt-10">
                            Please wait while we process your order and generate your ticket.
                        </p>
                        <div className="progress hs-25 my-50">
                            <div className="progress-bar progress-bar-secondary progress-bar-animated w-100" role="progressbar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="content text-end border-top pt-10">
            <span className="ms-auto text-muted fs-base-n2">
                &copy; 2022, SP Tech Inc. All rights reserved
            </span>
        </div>
    </div>
</div>
    </>
  )
}
