import React, { useEffect, useContext } from 'react';
import Web3ProviderWrapper from './web3/wrapper';

import { TokenGateRetrieve } from './api';
import { StyledContainer } from './components';
import { LoadingGate, TicketGate } from './gates';
import { TokenGateProvider, TokenGateContext } from './context';
import { TokenGateProviderInterface } from './props';
import './index.css';

// TokenGateRender
// Switch statement to render correct token-gate
const TokenGateRender = (): JSX.Element => {
	const { gateType } = useContext(TokenGateContext);
	console.log('gate render', gateType);
	switch(gateType){
		case('TICKET'):
			return <TicketGate/>
		default:
			return <LoadingGate/>
	}
}

// InitialDataFetch, updates on ID change
// Fetches & Sets TokenGate JSON, then passes data
const TokenGateFetch = (): JSX.Element => {
	const { id, json, httpStatus, setGateType, setJson, setHttpStatus } = useContext(TokenGateContext);
	console.log('gate fetch');
	// fetch initial tokengate API
	useEffect(() => {
		(async function() {
			console.log('http request');
			// check for ID string before
			if (typeof id === 'string' && id.length > 0){
				// fetch and set API response
				const response = await TokenGateRetrieve.call(id);
				if (response && response.httpStatus){
					// set data
					setJson(response);
					setHttpStatus(response.httpStatus);
				}
			}
		})();
	},[id]);

	useEffect(() => {
		console.log('setting gate type')
		if (httpStatus === 200){
			setGateType(json?.general_type);
		}
	},[httpStatus]);
	return (null)
}

// Main TokenGate component. Does a couple of things
// 1. Setup TokenGateProvider (react context)
// 2. Setup WAGMI web3 provider (need to make optional in future)
// 3. Renders GateHandler, which takes over token gate logic
// Takes in the following props:
// 1. ID: Public ID provided in SocialPass dashboard
// 2. Styles: Object used to configure styles (TBD)
const TokenGate = ({ id, styles, children }: TokenGateProviderInterface) => {
	return (
		<TokenGateProvider id={id} styles={styles}>
			<Web3ProviderWrapper>
				<StyledContainer>
					<TokenGateFetch/>
					<TokenGateRender/>
				</StyledContainer>
			</Web3ProviderWrapper>
		</TokenGateProvider>
	);
}

export default TokenGate;
