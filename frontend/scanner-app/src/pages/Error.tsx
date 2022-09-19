import React, { useCallback, useEffect, useState } from 'react'
import { Footer } from '../components/Footer'
import { FiArrowLeft } from 'react-icons/fi'
import Html5QrcodePlugin from '../components/Html5QrcodeScannerPlugin/Html5QrcodePlugin'
import useQRCodeScan from '../hooks/useQRCodeScan'
import { useEvent } from '../contexts/EventContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { fetchScanTicket } from '../services/api'
import { ProgressBar } from 'react-bootstrap'


export function Error() {
  const navigate = useNavigate()

  function handleRedirect() {
    navigate('..')
  }

  useEffect(() => {
    const scannerContainer = document.getElementById('qr-scanner-container')
    if (!scannerContainer) {
      return
    }
    ;(scannerContainer.firstChild?.firstChild as any).style.position = ''
  })



  const { startQrCode, decodedQRData } = useQRCodeScan({
    qrcodeMountNodeID: "qrcodemountnode",
  });

  useEffect(() => {
    // Add logic to add the camera and scan it
    startQrCode();
  }, []);


  return (
    <div className='scanner-body d-flex flex-column' >
      <div className='btn-close' style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <FiArrowLeft color='#f1f1f1' onClick={handleRedirect} size={26} />
      </div>
      <div className='flex-grow-1'>

        {/* <QrReader
          facingMode={'environment'}
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{ height: '100%', overflow: 'visible', position: 'relative' }}
        /> */}
        
          { <Html5QrcodePlugin 
          fps={10}
          qrbox={250}
          disableFlip={false}
          //qrCodeSuccessCallback={this.onNewScanResult}
          /> }
        
      </div>
    </div>
  )
}
