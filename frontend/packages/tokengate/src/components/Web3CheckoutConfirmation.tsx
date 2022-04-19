import React, { useContext, useEffect } from 'react';
import {  useSignMessage } from 'wagmi'
import { TokenGateContext } from '../context';
import { Web3ConnectorImage } from './Web3ConnectorImage';
import { TicketGateRequestAccess, TicketGateGrantAccess } from '../api';


// Web3CheckoutConfirmation Component
export const Web3CheckoutConfirmation = ({accountData, disconnect}:{accountData:any, disconnect:any}): JSX.Element => {
	// tokengate context
	const {
		id,
		gateType,
		requestAccessJson,
		setRequestAccessJson,
		setRequestAccessError,
		setGrantAccessJson,
		setGrantAccessError
	} = useContext(TokenGateContext);

	// wallet signature hooks
	// setup with signature_message
	const [{
			data: signData,
			error: signError,
			loading: signLoading
		},
		signMessage
	] = useSignMessage({
		message: requestAccessJson?.signature_message
	});
	// truncated address
	let address = accountData?.address ? accountData.address.substring(0,7) + "......" +
	accountData.address.substring(accountData.address.length-7) : '';

	// useEffect hook to request signature (based on web3 account data change)
	useEffect(() => {
		(async function() {
			let response;
			if (accountData && accountData?.address){
				switch(gateType){
					case('TICKET'):
						response = await TicketGateRequestAccess.call(id, 'blockchain');
						break;
					default:
						response = null;
				}
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRequestAccessJson(response);
					} else {
						setRequestAccessError(response);
					}
				}
			}
			})();
	},[accountData?.address]);

	// checkout handler
	// handles signing message and posting related data to API
	useEffect(() => {
		(async function() {
			if (signData){
			let response;
			switch(gateType){
				case('TICKET'):
					response = await TicketGateGrantAccess.call(
						id,
						'blockchain',
						accountData.address,
						signData,
						requestAccessJson.signature_id,
						'access_data',
					);
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

	return (
	<div className="base-gate">
		<div className="title">
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
		<div className="btn">
			<button className="btn-primary" onClick={async () => await signMessage()}>Checkout</button>
		</div>
	</div>
)
}
