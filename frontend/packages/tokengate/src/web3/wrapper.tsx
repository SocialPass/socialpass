import React from 'react';
import { Provider, chain, defaultChains, defaultL2Chains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = 'd16827de503c44b4bd9ab38d7404e9eb'

// Chains for connectors to support
const chains = [...defaultChains, ...defaultL2Chains]

// Set up connectors
type ConnectorsConfig = { chainId?: number }
const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl =
	chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
	chain.mainnet.rpcUrls[0]
  return [
	new InjectedConnector({
		chains,
		options: { shimDisconnect: true },
	}),
	new WalletConnectConnector({
	  options: {
		infuraId,
		qrcode: true,
	  },
	}),
	new CoinbaseWalletConnector({
	  options: {
		appName: 'SocialPass',
		jsonRpcUrl: `${rpcUrl}/${infuraId}`,
	  },
	}),
	/*
	new VenlyConnector(Venly,{
		options: {
			clientId: `${process.env.REACT_APP_VENLY_KEY}`
		}
	})*/
  ]
 }

const Web3ProviderWrapper = ({children}:{children:React.ReactNode}) => {
	return (
		<Provider
			connectors={connectors}
			connectorStorageKey="socialpass.wallet">
			{children}
		</Provider>
	)

}

export default Web3ProviderWrapper;
