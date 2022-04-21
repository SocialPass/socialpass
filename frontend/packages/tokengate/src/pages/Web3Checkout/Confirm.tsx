import React, { useContext, useEffect } from 'react';
import {  useSignMessage, useAccount } from 'wagmi'
import { TokenGateContext } from '../../context';
import { TokenGateGrantAccess } from '../../api';
import { Web3ConnectorImage } from '../../components';
import { Loading } from '../../components';


// Web3CheckoutConfirmation Component
export const Web3CheckoutConfirmation = (): JSX.Element => {
	// tokengate context
	const { id, retrieveJson, requestAccessJson, setGrantAccessJson, setGrantAccessError } = useContext(TokenGateContext);
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	// wallet signature hooks
	// setup with signature_message
	const [{data: signData, error: signError,loading: signLoading}, signMessage] = useSignMessage({
		message: requestAccessJson?.signature_message
	});

	// truncated address
	let address = accountData?.address ? accountData.address.substring(0,7) + "......" +
	accountData.address.substring(accountData.address.length-7) : '';

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

	if (signLoading){
		return <Loading/>
	}

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
							: address}
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
