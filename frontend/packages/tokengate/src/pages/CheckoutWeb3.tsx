import React from 'react';
import {  useAccount } from 'wagmi'
import { Web3ConnectWallet, Web3CheckoutSelection, Web3CheckoutConfirmation, Loading } from '../components';

// TicketGate Component
export const CheckoutWeb3 = (): JSX.Element => {
	// wallet data hooks
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	// account data present, proceed to rest of checkout
	if (accountData){
		// return either checkout confirmation or checkout selection

		// if no checkout data...
		// checkout selection (choose NFT's / assets to redeem)
		if (true){
			return <Web3CheckoutSelection/>
		}

		// web3 checkout confirmation (signature + api)
		return (
			<Web3CheckoutConfirmation accountData={accountData} disconnect={disconnect}/>
		)
	}

	// account data loading
	if (accountLoading){
		return <Loading/>
}

	// Account error
	if (accountError){
		return <div>Error account data</div>
	}

	// default, return connect wallet
	return (
		<Web3ConnectWallet/>
	)
}
