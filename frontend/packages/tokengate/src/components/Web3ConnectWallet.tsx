import React from 'react';
import {  useConnect } from 'wagmi';
import { Web3ConnectorImage } from './Web3ConnectorImage';

// ConnectorWallets
// Return UI for wallet connectors
export const Web3ConnectWallet = () => {
	// wallet connect hooks
	const [{ data: connectData, error: connectError, loading: loadingConnect }, connect] = useConnect();

	// account data present, proceed to rest of checkout
	if (connectData){
		// Return either signature or asset selection (if applicable)
		return (
			<div>
				<div className="base-inside">
					<h1>Connect Your Wallet</h1>
				</div>
				<div className="base-inside">
					{connectData.connectors.map((x) => (
					<button disabled={!x.ready} key={x.id}
						onClick={() => connect(x)}>
						<Web3ConnectorImage connector={x.name}/>
						{x.name}
						{!x.ready && ' (unsupported)'}
					</button>
				  ))}
				</div>
				{connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
			</div>
		)
	}
}
