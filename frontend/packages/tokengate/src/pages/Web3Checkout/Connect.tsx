import React, { useEffect } from 'react';
import {  useConnect, useAccount } from 'wagmi';
import { useNavigate } from "react-router-dom";
import { Web3ConnectorImage } from '../../components/Web3ConnectorImage';
import { Loading } from '../../components/Loading';

// ConnectorWallets
// Return UI for wallet connectors
export const Web3ConnectWallet = () => {
	const navigate = useNavigate();
	const [{ data: connectData, error: connectError, loading: loadingConnect }, connect] = useConnect();
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	useEffect(() => {
		if (accountData?.address){
			navigate('/checkout/web3/select');
		}
	}, [accountData?.address])


	return (
		<div className="row">
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
