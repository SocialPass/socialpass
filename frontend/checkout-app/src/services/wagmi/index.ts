import { createClient, defaultChains, configureChains } from 'wagmi'

import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'


const infuraId = '4529f731f04441bb9ee2836f6583b81d'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: infuraId }),
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
        appName: 'wagmi.sh',
        jsonRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/yourAlchemyId',
      },
    }),
  ],
  provider,
  webSocketProvider,
})
