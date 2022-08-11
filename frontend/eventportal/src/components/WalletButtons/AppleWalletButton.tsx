import appleWalletIcon from '../../static/images/icons/aw-icon.png'

export default function AppleWalletButton() {
  return (
    <button className='btn-apple-wallet d-flex align-items-center justify-content-start gap-5 mt-15'>
      <img className='wallet-icon' src={appleWalletIcon} alt='apple wallet icon' />
      <div>
        <span className='d-block fs-12 text-start'>Add to</span> Apple Wallet
      </div>
    </button>
  )
}
