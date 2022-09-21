import { useState } from 'react'
import { Html5QrcodeScanner } from '@/components/Html5QrcodeScanner'

import useEvent from '@/hooks/useEvent'
import { useNavigate, useParams } from 'react-router-dom'
import { TicketApi } from '@/services/api'
import Button from '@/components/Button'

const Scanner = () => {
  const { redemptionPublicId } = useParams()
  const navigate = useNavigate()
  const { event, setEvent }: any = useEvent()
  // const { addToast, clearToasts } = useToast()

  const handleRedirect = () => {
    navigate('..')
  }

  const handleScan = (qrcode: any) => {
    console.log(qrcode)
    // TicketApi.claim(event.publicId, qrCode)
    //   .then((data) => {
    //     setEvent({
    //       ...event,
    //       ticket_count: data.ticket_count,
    //       redeemed_count: data.redeemed_count,
    //     })
    //     // addToast({
    //     //   type: 'success',
    //     //   title: 'Succesful Scan',
    //     //   description: '',
    //     // })
    //   })
    //   .catch((err_data: any) => {
    //     // addToast({
    //     //   type: 'error',
    //     //   title: 'Scan Failed',
    //     //   description: err_data?.message,
    //     // })
    //     setScanFailureBlock({
    //       ...initialScanFailureBlock,
    //       active: true,
    //     })
    //   })
    //   .finally(() => {
    //     setWaitingForScan(false)
    //   })
  }

  return (
    <>
      <div className='position-relative d-flex align-items-center justify-content-center border hs-400'>
        <span className='text-center'>
          {
            <Html5QrcodeScanner
              fps={1}
              qrbox={{ width: 200, height: 200 }}
              facingMode='environment'
              onScan={(result) => handleScan(result)}
            />
          }
        </span>
        <button
          type='button'
          className='btn btn-square btn-rounded border-transparent shadow position-absolute top-0 start-0 m-10'
          onClick={() => handleRedirect()}
        >
          <i className='fa-solid fa-arrow-left'></i>
          <span className='visually-hidden'>Go Back</span>
        </button>
      </div>

      <div className='mt-auto'>
        <div className='content'>
          <h1 className='fw-700 fs-base-p6 mt-0'>{event.title}</h1>
          <div className='mt-15'>
            <i className='fa-regular fa-clock me-5'></i>
            {event.start_date}
          </div>
          <div className='row mt-15'>
            <div className='col-6 pe-5'>
              <div className='bg-secondary text-on-secondary rounded-3 py-10 px-15 h-100'>
                <strong className='antialiased'>Accepted: {event?.redeemed_count || 0}</strong>
              </div>
            </div>
            <div className='col-6 ps-5'>
              <div className='bg-secondary text-on-secondary rounded-3 py-10 px-15 h-100'>
                <strong className='antialiased'>
                  Remaining: {event?.ticket_count || event?.capacity}
                </strong>
              </div>
            </div>
          </div>

          <Button
            className='mt-30'
            onClick={() => {
              navigate(`/${redemptionPublicId}/statistics`)
            }}
          >
            <strong className='antialiased'>Statistics</strong>
          </Button>
        </div>
      </div>
    </>
  )
}

export default Scanner
