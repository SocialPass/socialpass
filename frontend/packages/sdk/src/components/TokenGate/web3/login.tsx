import React from 'react';
import { Provider, chain, defaultChains, defaultL2Chains, useConnect, useAccount } from 'wagmi'
import { LoginProps } from '../../../props';

// Web3 Provider authentication
// Renders TokenGate children (Ticket, Airdrop, etc.,), or login screen
const ProviderAuthentication = ({step, setStep}:LoginProps) => {
	const [{ data: connectData, error: connectError }, connect] = useConnect();
	const [{ data: accountData }, disconnect] = useAccount({
		fetchEns: true,
	});

	// If accountData provided...
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
		  </div>
		)
	}

	// If NO accountData provided, show login options
	return (
		<div>
		<h1>Connect Wallet to access</h1>
		  {connectData.connectors.map((x) => (
			<button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
			  {x.name}
			  {!x.ready && ' (unsupported)'}
			</button>
		  ))}
		  {connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
		  <br/>
		</div>
	)
}

export default ProviderAuthentication;
