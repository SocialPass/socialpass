import { Html5Qrcode } from 'html5-qrcode';
import { useState, useEffect, useRef } from 'react';

export function useQRCodeScan({
  qrcodeMountNodeID = '',
  closeAfterScan = true,
  getQrBoxDimension,
}) {
  const [decodedQRData, setDecodedQrData] = useState({
    isScanning: false,
    isScanSuccess: false,
    isScanFailure: false,
    data: null,
    error: '',
  });
  const html5QrCodeScannerRef = useRef(null);

  // unmount logic
  useEffect(() => {
    return () => {
      if (html5QrCodeScannerRef.current) {
        html5QrCodeScannerRef.current
          ?.stop()
          ?.then((ignore) => {
            // QR Code scanning is stopped
            // console.log('stopped after successful scan');
          })
          ?.catch((err) => {
            // Stop failed, handle it.
            // console.log('fails to stop after successfull scan result ');
          });
      }
    };
  }, []);

  function stopQrCode() {
    if (html5QrCodeScannerRef.current) {
      html5QrCodeScannerRef.current
        ?.stop()
        ?.then((ignore) => {
          // QR Code scanning is stopped
          //   console.log('stopped after successful scan');
          if (html5QrCodeScannerRef.current) {
            setDecodedQrData({
              ...decodedQRData,
              isScanning: false,
              data: null,
              error: '',
            });
          }
        })
        ?.catch((err) => {
          // Stop failed, handle it.
          //   console.log('fails to stop after successfull scan result ');
        });
    }
  }
  function startQrCode() {
    try {
      // eslint-disable-next-line
      const html5qrCodeScanner = new Html5Qrcode(qrcodeMountNodeID);

      html5QrCodeScannerRef.current = html5qrCodeScanner;

      let qrbox = {width: 250, height: 250};
      if (getQrBoxDimension) {
        qrbox = getQrBoxDimension();
      }

      setDecodedQrData({
        ...decodedQRData,
        isScanning: true,
        data: null,
      });

      html5qrCodeScanner
        .start(
          //   { deviceId: { exact: cameraId } },
          { facingMode: 'environment' },

          { fps: 60, qrbox, aspectRatio: 1 },
          (qrCodeMessage) => {
            // do something when code is read
            // console.log('scanned qr code', qrCodeMessage);

            setDecodedQrData({
              ...decodedQRData,
              isScanSuccess: true,
              isScanning: false,
              data: qrCodeMessage,
              error: '',
            });

            if (closeAfterScan) {
              html5qrCodeScanner
                .stop()
                .then((ignore) => {
                  // QR Code scanning is stopped.
                  // setIsOpenCamera(false);
                  //   console.log('stopped after successful scan');
                })
                .catch((err) => {
                  // Stop failed, handle it.
                  //   console.log('fails to stop after succesfull scan result ');
                });
            }
          },
          (errorMessage) => {}
        )
        .catch((err) => {
          setDecodedQrData({
            ...decodedQRData,
            isScanSuccess: false,
            isScanning: false,
            isScanFailure: true,
            data: null,
            error: err || 'QR Code parsing failed',
          });
        });
    } catch (e) {
      setDecodedQrData({
        ...decodedQRData,
        isScanSuccess: false,
        isScanning: false,
        isScanFailure: true,
        data: null,
        error: e || 'QR Code parsing failed',
      });
    }
  }

  return {
    startQrCode,
    decodedQRData,
    stopQrCode,
  };
}
export default useQRCodeScan