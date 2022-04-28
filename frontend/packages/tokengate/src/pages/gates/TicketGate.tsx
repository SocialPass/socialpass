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
		<div className="row flex-grow-1 m-0 mt-3">
			<div className="col-md-7">
				<h1>{retrieveJson.title}</h1>
				<p>{retrieveJson.description}</p>
				<p>Friday, April 15 | 8:00 - 10:30 PM EST
					James L. Knight Center | Miami, FL
				</p>
				<span>
					4,000 out of 50,000 available
				</span>
			</div>
			<div className="col-md-5">
				<button className="btn-primary" onClick={() => navigate('/checkout/web3/connect')}>Get Access</button>
			</div>
		</div>
		)
	}

