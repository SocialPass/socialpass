import { useRef } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { Footer } from '../components/Footer'
import Html5QrcodePlugin from '../components/Html5QrcodeScannerPlugin/Html5QrcodePlugin'
import { useEvent } from '../contexts/EventContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { fetchScanTicket } from '../services/api'
import { MdBorderBottom } from 'react-icons/md'


export function Scanner() {
  const navigate = useNavigate()
  const { eventData, setEventData, publicId }: any = useEvent()
  const { addToast, clearToasts } = useToast()

  const previousQrCodeReadRef = useRef();

  function handleRedirect() {
    navigate('..')
  }

  const handleScan = (qrcode: any) => {
    if (qrcode && qrcode != previousQrCodeReadRef.current) {
      previousQrCodeReadRef.current = qrcode
      clearToasts()
      fetchScanTicket(publicId, qrcode)
        .then((data) => {
          setEventData({
            ...eventData,
            ticket_count: data.ticket_count,
            redeemed_count: data.redeemed_count,
          })
          addToast({
            type: 'success',
            title: 'Succesful Scan',
            description: '',
          })
        })
        .catch((err_data: any) => {
          addToast({
            type: 'error',
            title: 'Scan Failed',
            description: err_data?.message,
          })
        })
    }
  }

  return (
    <div className='scanner-body d-flex flex-row' >
      <div className='btn-close' style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <FiArrowLeft color='#f1f1f1' onClick={handleRedirect} size={26} />
      </div>
      <div>
        <div className='reader-wrapper'>
          <Html5QrcodePlugin
            fps={1}
            qrbox={250}
            disableFlip={true}
            onScan={handleScan}
          />
        </div>
        <Footer></Footer>
      </div>
    </div>
  )
}
