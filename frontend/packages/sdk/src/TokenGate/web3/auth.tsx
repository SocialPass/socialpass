import React, { useCallback, useEffect } from 'react';
import {  useConnect, useAccount, useSignMessage } from 'wagmi'
import { TokenGateContext } from '../context';
import { accessGateHandler } from '../api';

// Web3 Provider authentication
const Web3ProviderAuthentication = () => {
	/****************** GLOBALS *************************/
	// context
	const { id, json, setJson2, setStep, setHttpStatus2 } = React.useContext(TokenGateContext);
	// wallet connect hooks
	const [{ data: connectData, error: connectError }, connect] = useConnect();
	// wallet account hooks
	const [{ data: accountData, loading: accountLoading }, disconnect] = useAccount();
	// walet sig hooks
	const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage();

	/****************** FUNCTIONS *************************/
	// Signature Handler
	const signatureHandler = async () => {
		// message setup
		let message = json?.signature.message
		// sign message
		const signRes = await signMessage({ message: message });
		if (signRes.error) throw signRes.error;

		// reset http
		setJson2(null);
		setHttpStatus2(0);

		// Verify Message/Wallet
		if (signRes && accountData && accountData.address){
			// send off message
			let response = await accessGateHandler({
				address: accountData.address,
				tokengate_id: id,
				signature_id: json?.signature.id,
				signed_message: signRes.data
			});
			if (response && response.httpStatus){
				setJson2(response);
				setHttpStatus2(response.httpStatus);
				setStep(2);
			}
		}
	}

	/****************** RETURN *************************/
	// If accountData provided...
	if (accountData) {
		return (
		  <div>
			<h1>Verify Wallet</h1>
			<div>
				<div>
				{accountData.ens?.avatar && <img src={accountData.ens?.avatar || ''} alt="ENS Avatar" />}
		  		{accountData.ens?.name
					? `${accountData.ens?.name} (${accountData.address})`
					: accountData.address}
				</div>
				<div>
					<div>Connected to {accountData.connector?.name}</div>
					<button onClick={() => signatureHandler()}>Sign Message</button>
					<br/>
					<button onClick={() => disconnect()}>Disconnect</button>
				</div>
			</div>
		  </div>
		)
	}

	// If NO accountData provided...
	else {
		return (
			<div>
				<h1>Connect Wallet</h1>
				<div>
			    	{connectData.connectors.map((x) => (
					<button disabled={!x.ready} key={x.id}
						onClick={() => connect(x)}>
				  		{x.name}
				  		{!x.ready && ' (unsupported)'}
					</button>
			  	))}
			  	</div>
			  {connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
			  <br/>
			</div>
		)
	}
}

export default Web3ProviderAuthentication;
