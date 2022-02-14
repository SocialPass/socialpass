import React, { useContext } from 'react';
import { TokenGateContext } from '../context';

const TicketGate = () => {
	const { id, json, step } = React.useContext(TokenGateContext)

	return (
		<>
		<h2>Ticket Gate</h2>
		<h3>Gate Info</h3>
		<ul>
			<li>ID: {id}</li>
			<li>JSON: {json}</li>
			<li>Step: {step}</li>
		</ul>
		</>
	)
}

export default TicketGate;
