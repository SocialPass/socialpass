import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { TokenGateContext } from '../../context';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const navigate = useNavigate();
	const { retrieveJson } = useContext(TokenGateContext);


	// default, return baseGate
	// todo: customize basegate more, perhaps current content as children
	return (
			<div className="row m-0">
				<div className="col-md-6">
					<h1>{retrieveJson.title}</h1>
					<p>{retrieveJson.description}</p>
				</div>
				<div className="col-md-6">
					<button className="btn-primary" onClick={() => navigate('/checkout/web3/connect')}>Get Access</button>
				</div>
			</div>
		)
	}

