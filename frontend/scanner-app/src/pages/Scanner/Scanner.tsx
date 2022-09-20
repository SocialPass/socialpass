import React, { useCallback, useEffect, useState } from 'react'
import Html5QrcodePlugin from '@/components/Html5QrcodeScannerPlugin/Html5QrcodePlugin'
import useQRCodeScan from '@/hooks/useQRCodeScan'
import { useEvent } from '@/contexts/EventContext'
import { useNavigate, useParams } from 'react-router-dom'
import { TicketApi } from '@/services/api'
import Button from '@/components/Button'

type ScanFailureBlockProps = {
  active: boolean
  intervalId: any
  progress: number
}
const Scanner = () => {
  const [waitingForScan, setWaitingForScan] = useState<boolean>(false)
  const { redemptionPublicId } = useParams()

  const [qrCode, setQrcode] = useState(null)
  const navigate = useNavigate()
  const { event, setEvent }: any = useEvent()
  // const { addToast, clearToasts } = useToast()
  const initialScanFailureBlock = {
    active: false,
    intervalId: undefined,
    progress: 0,
  }
  const [scanFailureBlock, setScanFailureBlock] = useState<ScanFailureBlockProps>({
    active: false,
    intervalId: undefined,
    progress: 0,
  })
  const [elapsedTime, setElapsedTime] = useState(0)

  const PROGRESS_TIME_IN_MS = 3000
  const STEP_TIME_IN_MS = 5
  const MAX_PROGRESS = 110

  useEffect(() => {
    setScanFailureBlock({
      ...initialScanFailureBlock,
      active: false,
    })
    if (!qrCode) {
      return
    }

    setWaitingForScan(true)
    // clearToasts()
    TicketApi.claim(event.publicId, qrCode)
      .then((data) => {
        setEvent({
          ...event,
          ticket_count: data.ticket_count,
          redeemed_count: data.redeemed_count,
        })
        // addToast({
        //   type: 'success',
        //   title: 'Succesful Scan',
        //   description: '',
        // })
      })
      .catch((err_data: any) => {
        // addToast({
        //   type: 'error',
        //   title: 'Scan Failed',
        //   description: err_data?.message,
        // })
        setScanFailureBlock({
          ...initialScanFailureBlock,
          active: true,
        })
      })
      .finally(() => {
        setWaitingForScan(false)
      })
  }, [qrCode])

  function handleRedirect() {
    navigate('..')
  }

  const handleScan = (qrcode: any) => {
    if (qrcode) {
      setQrcode(qrcode)
    }
  }

  useEffect(() => {
    const scannerContainer = document.getElementById('qr-scanner-container')
    if (!scannerContainer) {
      return
    }
    ;(scannerContainer.firstChild?.firstChild as any).style.position = ''
  })

  const handleError = useCallback((err: any) => {
    console.log(err)
    // addToast({
    //   type: 'error',
    //   title: 'QR Reader Error',
    //   description: '...',
    // })
  }, [])

  useEffect(() => {
    if (!scanFailureBlock.active) {
      if (scanFailureBlock.intervalId) {
        clearInterval(scanFailureBlock.intervalId)
      }
      setScanFailureBlock(initialScanFailureBlock)
      setElapsedTime(0)
      return
    }

    scanFailureBlock.intervalId = setInterval(() => {
      setElapsedTime((t) => t + STEP_TIME_IN_MS)
    }, STEP_TIME_IN_MS)

    return () => clearInterval(scanFailureBlock.intervalId)
  }, [scanFailureBlock.active])

  useEffect(() => {
    if (!scanFailureBlock.active) {
      return
    }

    if (elapsedTime < PROGRESS_TIME_IN_MS) {
      setScanFailureBlock({
        ...scanFailureBlock,
        progress: (elapsedTime / PROGRESS_TIME_IN_MS) * MAX_PROGRESS,
      })
    } else {
      setScanFailureBlock({
        ...initialScanFailureBlock,
        active: false,
      })
      setQrcode(null)
    }
  }, [elapsedTime])

  const { startQrCode, decodedQRData } = useQRCodeScan({
    qrcodeMountNodeID: 'qrcodemountnode',
  })

  useEffect(() => {
    // Add logic to add the camera and scan it
    startQrCode()
  }, [])

  return (
    <>
      <div className='position-relative d-flex align-items-center justify-content-center border hs-400'>
        <span className='text-center'>
          Insert Camera Here
          {/* {<Html5QrcodePlugin fps={30} qrbox={{ width: 250, height: 250 }} />} */}
        </span>
        <button
          type='button'
          className='btn btn-square btn-rounded border-transparent shadow position-absolute top-0 start-0 m-10'
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
