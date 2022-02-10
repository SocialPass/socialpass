import React, { useContext } from 'react';
import { TokenGateContext } from '../context';

const TicketGate = () => {
	const { id, json, gateType, step } = React.useContext(TokenGateContext)

	return (
		<>
		<h2>Ticket Gate</h2>
		<h3>Gate Info</h3>
		<ul>
			<li>ID: {id}</li>
			<li>Type: {gateType}</li>
			<li>JSON: {json}</li>
			<li>Step: {step}</li>
		</ul>
		</>
	)
}

export default TicketGate;
