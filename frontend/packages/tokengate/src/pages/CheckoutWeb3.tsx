import React, { useContext } from 'react';
import {  useAccount } from 'wagmi'
import { Web3ConnectWallet, Web3CheckoutSelection, Web3CheckoutConfirmation } from '../components';
import { TokenGateContext } from '../context';

// TicketGate Component
export const CheckoutWeb3 = (): JSX.Element => {
	// tokengate context
	const { checkoutSelection } = useContext(TokenGateContext);
	// wallet data hooks
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	// account data present, proceed to rest of checkout
	// return either checkout confirmation or checkout selection
	if (accountData){
		// checkout selection (choose NFT's / assets to redeem)
		if (!checkoutSelection){
			return <Web3CheckoutSelection accountData={accountData}/>
		}

		// proceed to web3 checkout confirmation
		if (checkoutSelection){
			return (
				<Web3CheckoutConfirmation accountData={accountData} disconnect={disconnect}/>
			)
		}
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
