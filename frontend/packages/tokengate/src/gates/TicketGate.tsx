import React from 'react';
import { TokenGateContext } from '../context';
import { BaseGate } from './BaseGate';

// TicketGate Component
export const TicketGate = (): JSX.Element => {
	const { retrieveJson } = React.useContext(TokenGateContext);
	return (
		<BaseGate>
			<div className="image">
				<img src={retrieveJson.team_image} alt="Team Image"/>
				<h3>{retrieveJson.team_name}</h3>
			</div>
			<div className="title">
				<h1>{retrieveJson.title}</h1>
				<p>{retrieveJson.description}</p>
			</div>
			<div className="btn">
				<button className="btn-primary" onClick={() => console.log(1)}>Get Access</button>
			</div>
		</BaseGate>
	)
}
