import React from 'react';
import {  useConnect } from 'wagmi';
import { Web3ConnectorImage } from './';

// ConnectorWallets
// Return UI for wallet connectors
export const Web3ConnectWallet = () => {
	// wallet connect hooks
	const [{ data: connectData, error: connectError, loading: loadingConnect }, connect] = useConnect();

	// account data present, proceed to rest of checkout
	if (connectData){
		// Return either signature or asset selection (if applicable)
		return (
			<div className="wallets">
				{connectData?.connectors.map((x) => (
				<button disabled={!x.ready} key={x.id}
					onClick={() => connect(x)}>
					<Web3ConnectorImage connector={x.name}/>
					{x.name}
					{!x.ready && ' (unsupported)'}
				</button>
			  ))}
			</div>
		)
	}

	// account data loading
	if (connectError){
		return <div>Loading connect data</div>
	}

	// Account error
	if (loadingConnect){
		return <div>Error connect data</div>
	}

	return <div>Loading...</div>
}
