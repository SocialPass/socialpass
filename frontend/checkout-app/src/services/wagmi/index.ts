import { createClient, defaultChains, configureChains } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

// import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'


const alchemyId = 'QjOQZlRRkBjrnhkPetrMjiWpOnK6u8A1'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: alchemyId }),
  publicProvider(),
])

// Set up client
export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        rpc: {
          1: 'https://eth-mainnet.alchemyapi.io/v2/{alchemy_id}',
        },
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'SocialPass',
        jsonRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/{alchemy_id}',
      },
    }),
  ],
  provider,
  webSocketProvider,
})
