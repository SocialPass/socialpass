import React from 'react';
import { TokenGateChildProps } from '../../../props';

const AirdropGate = ({json, gateType}: TokenGateChildProps) => {
	return (
		<>
		<h2>AirdropGate Component</h2>
		<ul>
			Gate Info
			<li>JSON: {json}</li>
			<li>Type: {gateType}</li>
		</ul>
		</>
	)
}

export default AirdropGate;
