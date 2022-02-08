import React from 'react';
import {TokenGateChildProps} from '../../../props';

const TicketGate = ({json, gateType}: TokenGateChildProps) => {
	return (
		<>
		<h2>TicketGate Component</h2>
		<ul>
			Gate Info
			<li>JSON: {json}</li>
			<li>Type: {gateType}</li>
		</ul>
		</>
	)
}
export default TicketGate;
