import { useRef } from 'react'
import { Html5QrcodeScanner } from './Html5QrcodeScanner'
import { toast, Toaster } from 'react-hot-toast'
import { FiAlertTriangle } from 'react-icons/fi'


import useEvent from '@/hooks/useEvent'
import { useNavigate, useParams } from 'react-router-dom'
import { TicketApi } from '@/services/api'
import Button from '@/components/Button'

const Scanner = () => {
  const { redemptionPublicId } = useParams()
  const navigate = useNavigate()
  const { event, setEvent }: any = useEvent()
  const lastQR = useRef()

  const handleRedirect = () => {
    navigate('..')
  }

  const handleScan = (qrcode: any) => {
    if (qrcode && qrcode !== lastQR.current) {
      lastQR.current = qrcode
      TicketApi.claim(redemptionPublicId, qrcode)
        .then((data) => {
          console.log(data)
          setEvent({
            ...event,
            ticket_count: data.ticket_count,
            redeemed_count: data.redeemed_count,
          })

          toast.success(`Succesful Scan, Tier: ${data.ticket_tier.ticket_type}`)
        })
        .catch((err) => {
          if (err.message === 'Ticket has already been redeemed.')  {
            toast('Succesful Scan: Ticket has already been redeemed', {
            icon: '⚠️',
            });
            
          }
          else  {
            toast.error(`Scan Failed: ${err.message}`)
          }
        })

      setTimeout(() => {
        lastQR.current = undefined
      }, 2000)
    }
  }

  return (
    <>
      <div className='position-relative d-flex align-items-center justify-content-center border hs-400 overflow-hidden'>
        <span className='text-center'>
          <Html5QrcodeScanner
            fps={1}
            qrbox={{ width: 250, height: 250 }}
            facingMode='environment'
            onScan={(result) => handleScan(result)}
          />
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

      <div className='content'>
        <Button
          className='mt-0'
          onClick={() => {
            navigate(`/${redemptionPublicId}/manual-redeem`)
          }}
        >
          <strong className='antialiased'>Redeem Manually</strong>
        </Button>
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
                  Remaining: {event?.ticket_count - event?.redeemed_count}
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
