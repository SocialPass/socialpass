import { useEffect, useRef } from 'react'
import propTypes from 'prop-types'

import { Html5Qrcode } from 'html5-qrcode'

import styles from './Html5QrcodeScanner.module.css';

const Html5QrcodeScanner = (props) => {
  const { onScan, onError, facingMode, fps, qrbox, aspectRatio, disableFlip, className, style } =
    props

  const previewRef = useRef<HTMLDivElement>(null)

  const config = {
    fps,
    qrbox,
    aspectRatio,
    disableFlip,
  }

  useEffect(() => {
    if (!previewRef.current) {
      return
    }

    const html5Qrcode = new Html5Qrcode(previewRef.current.id)
    const didStart = html5Qrcode.start({ facingMode }, config, onScan, onError).then(() => true)

    return () => {
      didStart
        .then(() => html5Qrcode.stop())
        .catch((error) => {
          console.error('Error stopping scanner', error)
        })
    }
  }, [])

  return <div ref={previewRef} id={'preview'} className={`${styles.preview} ${className}`} style={style} />
}

export default Html5QrcodeScanner

Html5QrcodeScanner.propTypes = {
  onScan: propTypes.func,
  onError: propTypes.func,
  facingMode: propTypes.string.isRequired,
  fps: propTypes.number,
  qrbox: propTypes.object,
  aspectRatio: propTypes.number,
  disableFlip: propTypes.bool,
  className: propTypes.string,
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
}

Html5QrcodeScanner.defaultProps = {
  facingMode: 'environment',
}
