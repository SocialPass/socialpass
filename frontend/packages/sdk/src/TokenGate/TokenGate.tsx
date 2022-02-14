import React, { useState, useEffect } from 'react';
import AirdropGate from './gates/airdrop';
import TicketGate from './gates/ticket';
import Web3ProviderWrapper from './web3/wrapper';
import Web3ProviderAuthentication from "./web3/auth";
import { TokenGateProviderInterface } from './props';
import { TokenGateProvider, TokenGateContext } from './context';
import { fetchGateHandler } from './api';

// GateHandler
const GateHandler = () => {
	const { id, json, setJson } = React.useContext(TokenGateContext);

	// Gate Handler, updates on ID change
	// Fetches & Sets TokenGate JSON
	useEffect(() => {
		// get json
		let _json = fetchGateHandler({id});

		//setJson(_json);
	},[id]);

	// Render correct gate based on type
	const GateSwitch = () => {
		switch(id){
			case 'AIRDROP':
				return <AirdropGate/>
			case 'TICKET':
				return <TicketGate/>
			case 'ERROR':
				return <strong>Error</strong>
			default:
				return <strong>Loading...</strong>
		}
	}

	// Wrapper around GateSwitch (initial styling, provider authentication)
	return (
		<div style={{border: '1px solid red', padding: '1rem', width: '50%',}}>
			<h1>SocialPass</h1>
			<GateSwitch/>
			<Web3ProviderAuthentication/>
		</div>
	)
}


// Main TokenGate component. Does a couple of things
// 1. Setup WAGMI provider (need to make optional in future)
// 2. Renders GateHandler
// 3. API call based on provided ID. JSON object is passed down to GateHandler
const TokenGate = ({ id, styles }: TokenGateProviderInterface) => {
	return (
		<TokenGateProvider id={id} styles={styles}>
			<Web3ProviderWrapper>
				<GateHandler/>
			</Web3ProviderWrapper>
		</TokenGateProvider>
	);
}

export default TokenGate;
