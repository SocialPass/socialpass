import PropTypes from 'prop-types'

import { useConnect, useAccount, useDisconnect } from 'wagmi'

export default function AssetOwnershipCheckoutOption(props) {
  const { connectors } = props

  const accountHook = useAccount()
  const disconnectHook = useDisconnect()
  const connectHook = useConnect()

  const getWalletLogo = (walletName) => {
    switch (walletName) {
      case 'MetaMask':
        return 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
      case 'WalletConnect':
        return 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/492d95c038bbcde1517cab5fb90ed4514690e919/svg/circle/walletconnect-circle-blue.svg'
      case 'Coinbase Wallet':
        return 'https://www.svgrepo.com/show/331345/coinbase-v2.svg'
      case 'Binance':
        return 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg'
      default:
        return ''
    }
  }

  const truncateAddress = (address: string) => {
    const beginning = address.substring(0, 7)
    const end = address.slice(address.length - 7)
    return `${beginning}...${end}`
  }

  return (
    <>
      <div className='alert alert-primary text-base pe-none user-select-none' role='alert'>
        <h6 className='alert-heading fw-700 m-0'>
          <i className='fa-light fa-check-square text-primary me-5'></i>
          Proof of NFT ownership
        </h6>
        <p className='mt-5 mb-0'>Select from the Crypto wallet options below.</p>
      </div>

      {accountHook && accountHook.address ? (
        <div className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'>
          <div className='ws-50 hs-50 mr-10'>
            <img
              src={getWalletLogo(accountHook.connector?.name)}
              alt='Logo'
              className='w-auto h-100'
            />
          </div>

          <div>
            <div className='fw-700 antialiased'>Connected to {accountHook.connector?.name}</div>
            <div className='fs-base-n2 text-muted'>{truncateAddress(accountHook.address)}</div>
          </div>

          <button
            className='btn fs-10 ms-auto'
            onClick={() => {
              disconnectHook.disconnect()
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        connectors.map((connector) => (
          <button
            className='btn btn-lg btn-block py-10 fs-base text-base text-start d-flex align-items-center my-20'
            key={`connector-${connector.name}`}
            onClick={() => {
              connectHook.connect({ connector })
            }}
            disabled={!connector.ready}
          >
            <div>
              <div className='fw-700 antialiased'>{connector.name}</div>
              <div className='fs-base-n2 text-muted'>Connect wallet</div>
            </div>
            <div className='ws-25 hs-25 ms-auto'>
              <img src={getWalletLogo(connector.name)} alt='Logo' className='w-auto h-100' />
            </div>
          </button>
        ))
      )}
    </>
  )
}

AssetOwnershipCheckoutOption.propTypes = {
  connectors: PropTypes.array,
}
