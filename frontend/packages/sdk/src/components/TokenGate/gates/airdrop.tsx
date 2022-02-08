import React from 'react';
import { TokenGateChildProps } from '../../../props';

const AirdropGate = ({json, gateType, step, setStep}: TokenGateChildProps) => {
	return (
		<>
		<h2>AirdropGate Component</h2>
		<ul>
			Gate Info
			<li>JSON: {json}</li>
			<li>Type: {gateType}</li>
			<li>Step: {step}</li>
			<button onClick={() => setStep(step+=1)}></button>
		</ul>
		</>
	)
}

export default AirdropGate;
