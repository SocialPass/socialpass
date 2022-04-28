import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { TokenGateContext } from '../../context';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const navigate = useNavigate();
	const { retrieveJson } = useContext(TokenGateContext);
	console.log(retrieveJson);
	// default, return baseGate
	// todo: customize basegate more, perhaps current content as children
	return (
		<div className="row flex-grow-1 m-0 mt-3 align-items-center">
			<div className="col-md-7 mb-4 d-flex">
				<div className="col col-md-10">
					<h1>{retrieveJson.title}</h1>
					<p>{retrieveJson.description}</p>
					<p className="d-flex align-items-center m-0 mt-1 mb-1">
						<img src={require("../../static/images/icons/clock.svg")} height="16.9" width="16.9" className="me-1" alt="Date & Time"/>
						{retrieveJson.date} {retrieveJson.timezone}
					</p>
					<p className="d-flex align-items-center m-0 mt-1 mb-1">
						<img src={require("../../static/images/icons/location.svg")} height="16.9" width="16.9" className="me-1" alt="Date & Time"/>
						{retrieveJson.location}
					</p>
					<div className="bg-success p-3 strong">
						<strong>{retrieveJson.capacity - retrieveJson.ticket_count}</strong> out of {retrieveJson.capacity} available
					</div>
				</div>
			</div>
			<div className="col-md-5">
				<button className="btn-primary" onClick={() => navigate('/checkout/web3/connect')}>Claim Tickets</button>
			</div>
		</div>
		)
	}

