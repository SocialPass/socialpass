import React, { useCallback, useEffect } from 'react';
import {  useConnect, useAccount, useSignMessage } from 'wagmi'
import { TokenGateContext } from '../context';
import { accessGateHandler } from '../api';

const ConnectorImage = ({connector}) => {
	switch(connector){
		case 'MetaMask':
			return <img src={require("../static/images/connectors/metamask.svg")} alt="image"/>
		case 'WalletConnect':
			return <img src={require("../static/images/connectors/walletconnect.svg")} alt="image"/>
		case 'Coinbase Wallet':
			return <img src={require("../static/images/connectors/coinbase-wallet.svg")} alt="image"/>
		default:
			return null;
	}
}

// Web3 Provider authentication
export const Web3Login = () => {
	/****************** GLOBALS *************************/
	// context
	const { id, json, gateType, setJson2, setStep, setHttpStatus2 } = React.useContext(TokenGateContext);
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
				gateType: gateType,
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

	// If accountData provided...
	if (accountData) {
		let address = accountData.address.substring(0,7) + "......" + accountData.address.substring(accountData.address.length-7);
		return (
		<div className="base-gate">
			<div className="title">
				<h1>Almost There</h1>
				<p>Your wallet is almost connected! You need to click the “Sign Message” button to complete connection.</p>
				<h3>Connected Wallet</h3>
				<div style={{display:'flex'}}>
					<ConnectorImage connector={accountData.connector?.name}/>
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
				<button className="btn-primary" onClick={() => signatureHandler()}>Sign Message</button>
			</div>
		</div>
		)
	}

	// If NO accountData provided...
	else {
		return (
			<div className="base-gate">
				<div className="title">
					<h1>Connect Your Wallet</h1>
				</div>
				<div className="wallets">
						{connectData.connectors.map((x) => (
						<button disabled={!x.ready} key={x.id}
							onClick={() => connect(x)}>
							<ConnectorImage connector={x.name}/>
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
