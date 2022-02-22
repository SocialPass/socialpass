import React, { useState, useEffect } from 'react';
import AirdropGate from './gates/airdrop';
import TicketGate from './gates/ticket';
import Web3ProviderWrapper from './web3/wrapper';
import { TokenGateProviderInterface } from './props';
import { TokenGateProvider, TokenGateContext } from './context';
import { fetchGateHandler } from './api';

// GateHandler
const GateHandler = () => {
	const { id, json, setJson, httpStatus, setHttpStatus, httpStatus2 } = React.useContext(TokenGateContext);

	// Gate Handler, updates on ID change
	// Fetches & Sets TokenGate JSON
	useEffect(() => {
		(async function() {
			// set status to initial status (0)
			setHttpStatus(0);

			// fetch and set API response
			let response = await fetchGateHandler({id});
			if (response && response.httpStatus){
				setJson(response);
				setHttpStatus(response.httpStatus)
			}
		})();
	},[id]);

	// Render correct gate based on type
	const GateSwitch = () => {
		let _id = id.split('_');
		switch(_id[0]){
			case 'AIRDROP':
				return <AirdropGate/>
			case 'TICKET':
				return <TicketGate/>
			default:
				return <Loading/>
		}
	}

	// Error Component
	const Error = () => {
		return (
			<div>
				<h1>Error</h1>
				<h2>Status Code: {httpStatus}</h2>
			</div>
		)
	}

	// Loading Component
	const Loading = () => {
		return (
			<h1>Loading...</h1>
		)
	}

	const Styled = ({children}:{children:any}) => {
		return (
			<div style={{border: '1px solid red', padding: '1rem', width: '50%',}}>
				<h1>SocialPass</h1>
				{children}
			</div>
		)
	}



	// Status Wrapper
	// Once httpStatus is 200, rendering is handed off to child gates
	const Status = () => {
		// initial http status is 0, indicates loading
		if (httpStatus === 0){
			return <Loading/>
		}

		// non-200 http status, indicates error
		if (httpStatus !== 200) {
			return <Error/>
		}


		// 200 status, indicates success
		// hand rendering off to child gates in GateSwitch
		return <GateSwitch/>
	}


	return (
		<Styled>
			<Status/>
		</Styled>
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
