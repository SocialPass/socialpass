import React, { useContext, useEffect } from 'react';
import {  useSignMessage, useAccount } from 'wagmi'
import { useNavigate } from "react-router-dom";
import { TokenGateContext } from '../../context';
import { TokenGateGrantAccess } from '../../api';
import { Web3ConnectorImage } from '../../components';
import { Loading } from '../../components';


// Web3CheckoutConfirmation Component
export const Web3CheckoutConfirmation = (): JSX.Element => {
	//tokengate conntext
	const { id, retrieveJson, requestAccessJson, setWeb3CheckoutSelection, setGrantAccessJson, setGrantAccessError } = useContext(TokenGateContext);
	// navigation
	const navigate = useNavigate();
	// accountData
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();
	// wallet signature hooks
	// setup with signature_message
	const [{data: signData, error: signError,loading: signLoading}, signMessage] = useSignMessage({
		message: requestAccessJson?.signature_message
	});
	// checkout handler
	// handles signing message and posting related data to API
	useEffect(() => {
		(async function() {
			if (signData){
			let response;
			switch(retrieveJson.general_type){
				case('TICKET'):
					response = await TokenGateGrantAccess.call(
						id,
						retrieveJson.general_type,
						'blockchain',
						accountData.address,
						signData,
						requestAccessJson.signature_id,
						'access_data'
					)
					if (response.httpStatus === 200){
						setGrantAccessJson(response);
					} else {
						setGrantAccessError(response);
					}
					break;
				default:
					response = null;
			}}
		})();
	},[signData]);

	// useEffect hook to navigate back on wallet disconnect
	useEffect(() => {
		if (!accountData?.address){
			console.log('navigate');
			// reset associated state
			setWeb3CheckoutSelection([]);
			// navigate to wallet connection page
			navigate("/checkout/web3/connect");
		}
	}, [accountData?.address])

	if (signLoading){
		return <Loading/>
	}

	if (accountData?.address){
		return (
			<div className="row">
				<div className="base-inside">
					<h1>Almost There</h1>
					<p>Your wallet is almost connected! You need to click the “Sign Message” button to complete connection.</p>
					<h3>Connected Wallet</h3>
					<div style={{display:'flex'}}>
						<Web3ConnectorImage connector={accountData?.connector?.name}/>
						<div>
							<div>{accountData.connector?.name}</div>
							<div>
								{accountData.ens?.name
								? `${accountData.ens?.name} (${accountData.address})`
								: accountData.address}
							</div>
							<button onClick={() => disconnect()}>
							Switch Wallets
							</button>
						</div>
					</div>
				</div>
				<div className="base-inside">
					<button className="btn-primary" onClick={async () => await signMessage()}>Checkout</button>
				</div>
			</div>
		)
	}

	return <Loading/>

}
