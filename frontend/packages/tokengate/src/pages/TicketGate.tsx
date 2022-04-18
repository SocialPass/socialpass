import React from 'react';
import { useNavigate } from "react-router-dom";
import { BaseGate } from '../components';
import { TokenGateContext } from '../context';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const navigate = useNavigate();

	// default, return base gate
	return (
		<BaseGate navigateTo={() => navigate('/checkout/web3')}/>
	)
}
