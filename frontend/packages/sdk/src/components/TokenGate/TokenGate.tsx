import React from 'react';
import TicketGate from './_TicketGate';
import AirdropGate from './_AirdropGate';
import ProviderHandler from './_ProviderHandler';

interface TokenGateProps {
	id: number // ID of tokengate
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	provider?: any // [optional]: Externally passed in wagmi provider
}

interface GateTypeSwitchProps {
	id: number // ID of tokengate
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
}

// Conditionally render TokenGate component based on gateType
// Based on 'gateType' provided, import/use other components in this directory
const GateTypeSwitchHandler = ({id, gateType}:GateTypeSwitchProps) => {
	switch(gateType){
		case 'AIRDROP':
			return <AirdropGate/>
		case 'TICKET':
			return <TicketGate/>
	}
}


// Main TokenGate component
const TokenGate: React.FC<TokenGateProps> = ({ id, gateType, provider }: TokenGateProps) => {
	return (
		<ProviderHandler provider={provider}>
			<GateTypeSwitchHandler id={id} gateType={gateType}/>
		</ProviderHandler>
	);
}

export default TokenGate;
