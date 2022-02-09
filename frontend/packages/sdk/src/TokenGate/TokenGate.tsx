import React, { useState } from 'react';
import AirdropGate from './gates/airdrop';
import TicketGate from './gates/ticket';
import ProviderHandler from './web3/handler';
import ProviderAuthentication from "./web3/auth";
import {
	TokenGateParentProps,
	GateTypeSwitchProps,
	TokenGateChildProps
} from './props';

// Main four responsibilities of GateHandler
// 1. Conditionally render Child component based on gateType
// 2. Render Parent around Child (Parent component is for styling, etc.)
// 3. Pass in ProviderAuthentication
// 3. Provide set/setStep state for children to use
	// 0: Initial, connect wallet
	// 1: Verify
	// 2: Success
	// 3: Failure
const GateHandler = ({json, gateType}:GateTypeSwitchProps) => {
	const Child = ({json, gateType, step, setStep}:TokenGateChildProps) => {
		switch(gateType){
			case 'AIRDROP':
				return <AirdropGate json={json} gateType={gateType} step={step} setStep={setStep}/>
			case 'TICKET':
				return <TicketGate json={json} gateType={gateType} step={step} setStep={setStep}/>
			default:
				return <div><strong>{gateType}</strong> coming soon</div>
		}
	}

	const Parent = () => {
		const [step, setStep] = useState(0);
		return (
			<div style={{border: '1px solid red', padding: '1rem', width: '50%',}}>
				<h1>SocialPass</h1>
				<Child json={json} gateType={gateType} step={step} setStep={setStep}/>
				<ProviderAuthentication json={json} gateType={gateType} step={step} setStep={setStep}/>
			</div>
		)
	}

	return <Parent/>
}


// Main TokenGate component. Does a couple of things
// 1. Setup WAGMI provider (need to make optional in future)
// 2. Renders GateHandler
// 3. API call based on provided ID. JSON object is passed down to GateHandler
const TokenGate = ({ id, gateType }: TokenGateParentProps) => {
	const json = '';
	return (
		<ProviderHandler>
			<GateHandler json={json} gateType={gateType}/>
		</ProviderHandler>
	);
}

export default TokenGate;
