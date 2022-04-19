import React from 'react';
import { TokenGateContext } from '../context';

// Loading Component
// todo
export const Web3CheckoutSelection = ({accountData}:{accountData:any}) => {
	const { id, gateType, } = React.useContext(TokenGateContext);

	return (
		<h1>Web3CheckoutSelection...</h1>
	)
}
