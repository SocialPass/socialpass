import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { BaseGate } from '../components';
import { TokenGateContext } from '../context';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const navigate = useNavigate();
	const { grantAccessJson, grantAccessError } = useContext(TokenGateContext);

	// check for access granted json
	// indicates checkout has already been completed
	if (grantAccessJson){
		return <div>success</div>
	}

	// check for access granted error
	// indicates checkout has already been completed
	if (grantAccessError){
		return <div>error</div>
	}

	// default, return baseGate
	// todo: customize basegate more, perhaps current content as children
	return (
		<BaseGate navigateTo={() => navigate('/checkout/web3/connect')}/>
	)
}
