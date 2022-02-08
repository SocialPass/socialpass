import React, { useState } from 'react';
import ProviderHandler from './web3/provider';
import AirdropGate from './gates/airdrop';
import TicketGate from './gates/ticket';
import ProviderAuthentication from "./web3/login";
import { TokenGateParentProps, GateTypeSwitchProps } from '../../props';

// Main four responsibilities of GateHandler
// 1. Conditionally render Child component based on gateType
// 2. Render Parent around Child (Parent component is for styling, etc.)
// 3. Pass in ProviderAuthentication
// 3. Provide set/setStep state for children to use
const GateHandler = ({json, gateType}:GateTypeSwitchProps) => {
	const Child = ({step, setStep}:{step:number, setStep: any}) => {
		switch(gateType){
			case 'AIRDROP':
				return <AirdropGate json={json} gateType={gateType} step={step} setStep={setStep}/>
			case 'TICKET':
				return <TicketGate json={json} gateType={gateType} step={step} setStep={setStep}/>
			default:
				return <></>
		}
	}

	const Parent = () => {
		const [step, setStep] = useState(0);
		return (
			<div style={{border: '1px solid red', padding: '1rem'}}>
				<Child step={step} setStep={setStep}/>
				<ProviderAuthentication setStep={setStep} step={step}/>
			</div>
		)
	}

	return <Parent/>
}


// Main TokenGate component. Does a couple of things
// 1. Setup WAGMI provider (need to make optional in future)
// 2. Renders GateHandler
// 3. API call based on provided ID. JSON object is passed down to GateHandler
const TokenGate = ({ id, gateType, provider }: TokenGateParentProps) => {
	const json = '';
	return (
		<ProviderHandler provider={provider}>
			<GateHandler json={json} gateType={gateType}/>
		</ProviderHandler>
	);
}

export default TokenGate;
