import React from 'react';
import {  useAccount } from 'wagmi'
import { Web3ConnectWallet } from './'

// Web3Checkout
// Handles signature && asset selection (if applicable)
export const Web3Checkout = () => {
	// wallet data hooks
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();

	// account data present, proceed to rest of checkout
	if (accountData){
		// Return either signature or asset selection (if applicable)
		return
	}

	// account data loading
	if (accountLoading){
		return <div>Loading account data</div>
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

/*
checkout - blockchain
1. select wallet (Web3ConnectWallet)
2. select assets (if applicable) (Web3)
3. checkout (Web3Signature)
*/
