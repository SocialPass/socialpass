import React from 'react';
import {  useSignMessage } from 'wagmi'
import { TokenGateContext } from '../context';
import { Web3ConnectorImage } from './Web3ConnectorImage';


// TicketGate Component
export const Web3CheckoutConfirmation = ({accountData, disconnect}:{accountData:any, disconnect:any}): JSX.Element => {
	// tokengate context
	const { id, gateType, } = React.useContext(TokenGateContext);
	// wallet signature hooks
	const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage();
	// truncated address
	let address = accountData?.address ? accountData.address.substring(0,7) + "......" +
	accountData.address.substring(accountData.address.length-7) : '';

	// checkout handler
	// handles signing message and posting related data to API
	// signatureHandler function
	const signatureHandler = async () => {
		// todo
		const message = '';

		// sign message
		const signRes = await signMessage({ message: message });
		if (signRes.error) throw signRes.error;

		// Verify Message/Wallet
		if (signRes && accountData){
			console.log(id, gateType, signRes.data, signData, signLoading)
			return
		}
	}
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
				<button className="btn-primary" onClick={() => console.log('')}>Checkout</button>
			</div>
		</div>
	)
}
