import { createClient, defaultChains, configureChains } from 'wagmi'

import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const infuraId = '4529f731f04441bb9ee2836f6583b81d'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: infuraId }),
  publicProvider(),
])

// Set up client
export const Web3Provider = createClient({
  autoConnect: true,
  connectors: [
	new MetaMaskConnector({ chains }),
	new CoinbaseWalletConnector({
	  chains,
	  options: {
		appName: 'wagmi',
	  },
	}),
	new WalletConnectConnector({
	  chains,
	  options: {
		qrcode: true,
	  },
	}),
	new InjectedConnector({
	  chains,
	  options: {
		name: 'Injected',
		shimDisconnect: true,
	  },
	})
  ],
  provider,
  webSocketProvider,
})
