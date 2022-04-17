import React, { useEffect, useContext, useMemo } from 'react';
import Web3ProviderWrapper from './web3/wrapper';

import { TokenGateRetrieve } from './api';
import { StyledContainer } from './components';
import { LoadingGate, TicketGate } from './gates';
import { TokenGateProvider, TokenGateContext } from './context';
import { TokenGateProviderInterface } from './props';
require<any>('./index.css');

// TokenGateRender
// Switch statement to render correct token-gate
const TokenGateRender = React.memo(() => {
	const { gateType } = useContext(TokenGateContext);
	console.log('gate render', gateType)

	return useMemo(() => {
		// The rest of your rendering logic
		switch(gateType){
			case('TICKET'):
				return <TicketGate/>
			default:
				return <LoadingGate/>
		}
  	}, [gateType]);
})

// InitialDataFetch, updates on ID change
// Fetches & Sets TokenGate JSON, then passes data

const TokenGateFetch = () => {
	const { id, setRetrieveJson, setGateType, setRetrieveError } = useContext(TokenGateContext);
	console.log('gate fetch', id);

	useEffect(() => {
		(async function() {
			console.log('http request');
			// check for ID string before
			if (typeof id === 'string' && id.length > 0){
				const response = await TokenGateRetrieve.call(id);
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRetrieveJson(response);
						setGateType(response?.general_type);
					} else {
						setRetrieveError(response);
					}
				}
			}
		})();
	},[id]);



	// fetch initial tokengate API
	return null;
}


// Main TokenGate component. Does a couple of things
// 1. Setup TokenGateProvider (react context)
// 2. Setup WAGMI web3 provider (need to make optional in future)
// 3. Renders GateHandler, which takes over token gate logic
// Takes in the following props:
// 1. ID: Public ID provided in SocialPass dashboard
// 2. Styles: Object used to configure styles (TBD)
const TokenGate = ({ id, styles }: TokenGateProviderInterface) => {
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
