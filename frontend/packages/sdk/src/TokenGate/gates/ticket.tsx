import React from 'react';
import {TokenGateChildProps} from '../props';

const TicketGate = ({json, gateType, step, setStep}: TokenGateChildProps) => {
	return (
		<>
		<h2>Ticket Gate</h2>
		<h3>Gate Info</h3>
		<ul>
			<li>Type: {gateType}</li>
			<li>Step: {step}</li>
		</ul>
		</>
	)
}
export default TicketGate;
