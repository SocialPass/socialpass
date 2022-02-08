import React from 'react';
import {TokenGateChildProps} from '../../../props';

const TicketGate = ({json, gateType, step, setStep}: TokenGateChildProps) => {
	return (
		<>
		<h2>TicketGate Component</h2>
		<ul>
			Gate Info
			<li>JSON: {json}</li>
			<li>Type: {gateType}</li>
			<li>Step: {step}</li>
		</ul>
		</>
	)
}
export default TicketGate;
