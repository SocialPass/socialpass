import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { BaseGate } from '../../components';
import { TokenGateContext } from '../../context';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const navigate = useNavigate();
	const { retrieveJson } = useContext(TokenGateContext);


	// default, return baseGate
	// todo: customize basegate more, perhaps current content as children
	return (
		<BaseGate retrieveJson={retrieveJson} navigateTo={() => navigate('/checkout/web3/connect')}/>
	)
}
