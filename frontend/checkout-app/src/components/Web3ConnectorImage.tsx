// ConnectorImage
// Return image based on connector props
export const Web3ConnectorImage = ({ connector }: { connector: string | undefined }) => {
  switch (connector) {
    case 'MetaMask':
      return (
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
          className='d-block w-100'
          alt='Metamask'
        />
      )
    case 'WalletConnect':
      return (
        <img
          src='https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/492d95c038bbcde1517cab5fb90ed4514690e919/svg/circle/walletconnect-circle-blue.svg'
          className='d-block w-100'
          alt='WalletConnect'
        />
      )
    case 'Coinbase Wallet':
      return (
        <img
          src='https://avatars.githubusercontent.com/u/18060234?s=280&v=4'
          className='d-block w-100'
          alt='Coinbase'
        />
      )
    default:
      return null
  }
}
