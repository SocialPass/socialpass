import React from 'react';
import ProviderHandler from './ProviderHandler';

interface TokenGateProps {
	id: number // ID of tokengate
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	provider?: any // [optional]: web3 provider
}

interface GateTypeSwitchProps {
	id: number // ID of tokengate
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
}

const AirdropGate = ({id, gateType}: TokenGateProps) => {
	return (
		<>
		<h2>AirdropGate Component</h2>
		<ul>
			Gate Info
			<li>ID: {id}</li>
			<li>Type: {gateType}</li>
		</ul>
		</>
	)
}

const TicketGate = ({id, gateType}: TokenGateProps) => {
	return (
		<>
		<h2>TicketGate Component</h2>
		<ul>
			Gate Info
			<li>ID: {id}</li>
			<li>Type: {gateType}</li>
		</ul>
		</>
	)
}

// Conditionally render TokenGate component based on gateType
// Based on 'gateType' provided, import/use other components in this directory
const GateTypeSwitchHandler = ({id, gateType}:GateTypeSwitchProps) => {
	switch(gateType){
		case 'AIRDROP':
			return <AirdropGate id={id} gateType={gateType}/>
		case 'TICKET':
			return <TicketGate id={id} gateType={gateType}/>
	}
}


// Main TokenGate component
const TokenGate: React.FC<TokenGateProps> = ({ id, gateType, provider }: TokenGateProps) => {
	return (
		<div style={{ border: '10px solid red', }}>
		<h1>TOKENGATE COMPONENT</h1>
		<ProviderHandler provider={provider}>
			<GateTypeSwitchHandler id={id} gateType={gateType}/>
		</ProviderHandler>
		</div>
	);
}

export default TokenGate;
