import React from 'react';
import ProviderHandler from './web3/provider';
import AirdropGate from './gates/airdrop';
import TicketGate from './gates/ticket';
import ProviderAuthentication from "./web3/login";
import { TokenGateParentProps, GateTypeSwitchProps } from '../../props';

// 1. Conditionally render Child component based on gateType
// 2. Render Parent around child (Parent component is for styling, etc.)
// 3. Handle ProviderAuthentication, pass current setp down to Child
const GateHandler = ({json, gateType}:GateTypeSwitchProps) => {
	const Child = () => {
		switch(gateType){
			case 'AIRDROP':
				return <AirdropGate json={json} gateType={gateType}/>
			case 'TICKET':
				return <TicketGate json={json} gateType={gateType}/>
			default:
				return <></>
		}
	}

	const Parent = ({children, json}:{children:any}) => {
		return (
			<div style={{border: '1px solid red', padding: '1rem'}}>
				{children}
				<ProviderAuthentication/>
			</div>
		)
	}

	return <Parent><Child/></Parent>
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
