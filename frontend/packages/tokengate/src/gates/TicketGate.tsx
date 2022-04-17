import React from 'react';
import { BaseGate } from './BaseGate';
import { TokenGateContext } from '../context';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const { checkoutType } = React.useContext(TokenGateContext);

	// todo, switch on checkout type
	if (checkoutType){

	}

	// default, return base gate
	return (
		<BaseGate/>
	)
}
