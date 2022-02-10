import React, { useCallback, useEffect } from 'react';
import {  useConnect, useAccount, useSignMessage } from 'wagmi'
import { TokenGateContext } from '../context';

// Web3 Provider authentication
const Web3ProviderAuthentication = () => {
	/****************** GLOBALS *************************/
	// context
	const { setStep, json } = React.useContext(TokenGateContext);
	// wallet connect hooks
	const [{ data: connectData, error: connectError }, connect] = useConnect();
	// wallet account hooks
	const [{ data: accountData, loading: accountLoading }, disconnect] = useAccount();
	// walet sig hooks
	const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage();


	/****************** HOOKS *************************/
	// Step Handler, updates on accountData.address change
	useEffect(() => {
		if (accountData && accountData?.address) {
			console.log('setting 1')
			setStep(1);
		} else {
			console.log('setting 0');
			setStep(0)
		}
	},[accountData?.address]);


	/****************** FUNCTIONS *************************/
	// Signature Handler
	const signatureHandler = async (message:string) => {
		// Sign Message
		const signRes = await signMessage({ message: message });
		if (signRes.error) throw signRes.error;

		// Verify Message/Wallet
		console.log(signRes);

		// Update Step
		setStep(2);


	}

	/****************** RETURN *************************/
	// If accountData provided...
	if (accountData) {
		return (
		  <div>
			<h4>Verify Wallet</h4>
			{accountData.ens?.avatar && <img src={accountData.ens?.avatar || ''} alt="ENS Avatar" />}
			<div>
			  {accountData.ens?.name
				? `${accountData.ens?.name} (${accountData.address})`
				: accountData.address}
			</div>
			<div>Connected to {accountData.connector?.name}</div>
			<button onClick={() => disconnect()}>Disconnect</button>
			<button onClick={() => signatureHandler('json')}>Sign Message</button>
			<br/>
		  </div>
		)
	}

	// If NO accountData provided...
	else {
		return (
			<div>
				<h4>Connect Wallet</h4>
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
}

export default Web3ProviderAuthentication;
