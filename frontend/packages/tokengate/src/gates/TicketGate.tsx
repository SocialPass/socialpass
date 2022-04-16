import React from 'react';
import { TokenGateContext } from '../context';
import { BaseGate, Web3Checkout } from '../components';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const { json, setStep, step } = React.useContext(TokenGateContext);
	return (
		<BaseGate>
			<div className="image">
				<img src={json.team_image} alt="Team Image"/>
				<h3>{json.team_name}</h3>
			</div>
			<div className="title">
				<h1>{json.title}</h1>
				<p>{json.description}</p>
			</div>
			<div className="btn">
				<button className="btn-primary" onClick={() => setStep(1)}>Get Access</button>
			</div>
		</BaseGate>
	)
}
