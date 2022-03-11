import React, { useState, useEffect } from 'react';
import Web3ProviderWrapper from './web3/wrapper';
import BaseGate from './basegate';
import { TokenGateProviderInterface } from './props';
import { TokenGateProvider, TokenGateContext } from './context';
import { fetchGateHandler } from './api';
import './index.css'

// GateHandler
const GateHandler = () => {
	const { id, json, styles, setGateType, setJson, httpStatus, setHttpStatus, httpStatus2 } = React.useContext(TokenGateContext);

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
			<div className="styled-container">
				<header className="styled-header">
					<img src={require("../static/header1.svg")} alt="image" height="auto" width="100%"/>
				</header>
				<div className="styled-parent">
					{children}
				</div>
				<footer className="styled-footer">
					<small>?</small>
					<small>SocialPass</small>
				</footer>
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

		// 200 http status, indicates success
		// return base gate and set gate type
		if (httpStatus === 200) {
			let _id = id.split('_');
			setGateType(_id[0])
			return <BaseGate/>
		}

		return <Loading/>
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
