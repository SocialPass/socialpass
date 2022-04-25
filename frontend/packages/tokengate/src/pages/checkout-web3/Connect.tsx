import React, { useEffect, useContext} from 'react';
import {  useConnect, useAccount } from 'wagmi';
import { useNavigate } from "react-router-dom";
import { Web3ConnectorImage } from '../../components/Web3ConnectorImage';
import { TokenGateContext } from '../../context';

// ConnectorWallets
// Return UI for wallet connectors
export const Web3ConnectWallet = () => {
	const {setBackButton} = useContext(TokenGateContext);
	const navigate = useNavigate();
	const [{ data: connectData, error: connectError, loading: loadingConnect }, connect] = useConnect();
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	// useEffect hook to set back button and its side effects
	useEffect(() => {
		const back_button = null;
		setBackButton(() => back_button);
	},[])

	// navigate to checkout once account data i sloaded
	useEffect(() => {
		if (accountData?.address){
			navigate('/checkout/web3/checkout');
		}
	}, [accountData?.address])

	if (connectData){
		return (
			<div className="row d-flex align-items-center justify-content-center flex-grow-1">
				<div className="row">
					<h1>Connect Your Wallet</h1>
					{connectData.connectors.map((x) => (
						<button className="btn-secondary d-flex flex-column align-items-center justify-content-center col-md-4" disabled={!x.ready} key={x.id}
							onClick={() => connect(x)}>
							<Web3ConnectorImage connector={x.name}/>
							{x.name}
							{!x.ready && ' (unsupported)'}
						</button>
					))}
					{connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
				</div>
			</div>

		)
	}

	return null;
}
