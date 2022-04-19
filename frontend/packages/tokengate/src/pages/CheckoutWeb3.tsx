import React from 'react';
import {  useAccount } from 'wagmi'
import { Web3ConnectWallet, Web3CheckoutSelection, Web3CheckoutConfirmation } from '../components';

// TicketGate Component
export const CheckoutWeb3 = (): JSX.Element => {
	// tokengate context
	// wallet data hooks
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	// account data present, proceed to rest of checkout
	// return either checkout confirmation or checkout selection
	if (accountData){
		// todo: checkout selection component
		// checkout selection (choose NFT's / assets to redeem)
		if (false){
			return <Web3CheckoutSelection accountData={accountData}/>
		}

		// no checkout selection required, proceed to web3 checkout confirmation
		return (
			<Web3CheckoutConfirmation accountData={accountData} disconnect={disconnect}/>
		)
	}
	// account data error
	if (accountError){
		return <div>error</div>
	}
	// account loading
	if (accountLoading){
		return <div>loading</div>
	}
	// default, return connect wallet
	return (
		<Web3ConnectWallet/>
	)
}
