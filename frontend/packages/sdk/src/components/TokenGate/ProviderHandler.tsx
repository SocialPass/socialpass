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
	new InjectedConnector({ chains }),
	new WalletConnectConnector({
	  options: {
		infuraId,
		qrcode: true,
	  },
	}),
	new WalletLinkConnector({
	  options: {
		appName: 'My wagmi app',
		jsonRpcUrl: `${rpcUrl}/${infuraId}`,
	  },
	}),
  ]
 }

interface ProviderProps {
	children?: any
	provider?: any
}

// Web3 Provider authentication
// Renders TokenGate children (Ticket, Airdrop, etc.,), or login screen
const ProviderAuthentication = ({children, provider}:ProviderProps) => {
	const [{ data: connectData, error: connectError }, connect] = useConnect();
	const [{ data: accountData }, disconnect] = useAccount({
		fetchEns: true,
	});

	// If accountData provided, show children
	if (accountData) {
		return (
		  <div>
			<img src={accountData.ens?.avatar || ''} alt="ENS Avatar" />
			<div>
			  {accountData.ens?.name
				? `${accountData.ens?.name} (${accountData.address})`
				: accountData.address}
			</div>
			<div>Connected to {accountData.connector?.name}</div>
			<button onClick={disconnect}>Disconnect</button>
			<br/>
			{children}
		  </div>
		)
	}

	// If NO accountData provided, show login options
	return (
		<div>

		  {connectData.connectors.map((x) => (
			<button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
			  {x.name}
			  {!x.ready && ' (unsupported)'}
			</button>
		  ))}
		  {connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
		  <br/>
		  {children}
		</div>
	)
}


const ProviderHandler = ({children, provider}:ProviderProps) => {
	return (
		<Provider
			connectors={connectors}
			connectorStorageKey="socialpass.wallet">
			{children}
			<ProviderAuthentication/>
		</Provider>
	)

}

export default ProviderHandler;
