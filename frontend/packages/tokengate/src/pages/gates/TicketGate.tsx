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
				<div className="col col-md-9">
					<h1>{retrieveJson.title}</h1>
					<p>{retrieveJson.description}</p>
					<div>
						<p className="d-flex align-items-center m-0">
							<img src={require("../../static/images/icons/clock.svg")} height="16.9" width="16.9" className="me-1" alt="Date & Time"/>
							{retrieveJson.date}
						</p>
						<p className="d-flex align-items-center m-0">
							<img src={require("../../static/images/icons/location.svg")} height="16.9" width="16.9" className="me-1" alt="Date & Time"/>
							{retrieveJson.location}
						</p>
					</div>
					<div className="d-flex">
						<span className="bg-success p-3">
							{retrieveJson.ticket_count} out of {retrieveJson.capacity} available
						</span>
					</div>
				</div>
			</div>
			<div className="col-md-5">
				<button className="btn-primary" onClick={() => navigate('/checkout/web3/connect')}>Claim Tickets</button>
			</div>
		</div>
		)
	}

