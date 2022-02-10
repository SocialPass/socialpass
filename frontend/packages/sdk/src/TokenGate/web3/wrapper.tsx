import React from 'react';
import { Provider, chain, defaultChains, defaultL2Chains, useConnect, useAccount } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

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
	new WalletLinkConnector({
	  options: {
		appName: 'SocialPass',
		jsonRpcUrl: `${rpcUrl}/${infuraId}`,
	  },
	}),
  ]
 }

const Web3ProviderWrapper = ({children}:{children:any}) => {
	return (
		<Provider
			autoConnect
			connectors={connectors}
			connectorStorageKey="socialpass.wallet">
			{children}
		</Provider>
	)

}

export default Web3ProviderWrapper;
