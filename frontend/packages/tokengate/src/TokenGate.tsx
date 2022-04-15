import React, { useState, useCallback, useEffect, useContext } from 'react';
import {  useConnect, useAccount, useSignMessage } from 'wagmi'

import Web3ProviderWrapper from './web3/wrapper';
import { Web3Login } from "./web3/login";
import { TokenGateProviderInterface, GateType } from './props';
import { TokenGateProvider, TokenGateContext } from './context';
import { TokenGateRetrieve } from './api';
import './index.css';

/************************************* DISPLAY COMPONENTS *************************************/
// TickerImage component
// Displays ticker tape in header top right corner for type of gate
const TickerImage = () => {
	const { gateType } = useContext(TokenGateContext);
	switch(gateType){
		case 'TICKET':
			return <img className="ticker" src={require("./static/images/gates/ticket.svg")} alt="image"/>

		default:
			return null;
	}
}

// Loading Component
// todo
const Loading = () => {
	return (
		<h1>Loading...</h1>
	)
}

// Error Component
// todo
const Error = () => {
	const { httpStatus } = useContext(TokenGateContext);
	return (
		<div>
			<h1>Error</h1>
			<h2>Status Code: {httpStatus}</h2>
		</div>
	)
}

// StyledContainer component
// Display root layout (header, main content, footer)
const StyledContainer = ({children, gateType}:{children:React.ReactNode, gateType:GateType}) => {
	return (
		<div className="container">
			<header>
				<TickerImage/>
				<img src={require("./static/images/header1.svg")} alt="image"/>
			</header>
			<div className="parent">
				{children}
			</div>
			<footer className="footer">
				<img src={require("./static/images/FAQ.svg")} alt="image"/>
				<small style={{display:'flex',alignItems:'center'}}>
					Powered by &nbsp;
					<img src={require("./static/images/socialpass.svg")} alt="image"/>
				</small>
			</footer>
		</div>
	)
}


// InitialGate component
// Displays initial content of gate on-load
const InitialGate = () => {
	const { json, setStep } = React.useContext(TokenGateContext);
	return (
		<div className="base-gate">
			<div className="image">
				<img src={json.team_image} alt="Team Image"/>
				<h3>{json.team_name}</h3>
			</div>
			<div className="title">
				<h1>{json.title}</h1>
				<p>{json.description}</p>
			</div>
			<div className="btn">
				<button className="btn-primary" onClick={() => setStep(1)}>Get Access</button>
			</div>
		</div>
	)
}


/************************************* Logic COMPONENTS *************************************/
// Reward component
// Display tokengate reward screen (Success or failure)
const Reward = () => {
	const { json2, httpStatus2 } = useContext(TokenGateContext);

	// non-200 http status, indicates failure
	if (httpStatus2 !== 200 && httpStatus2 !== 0) {
		return (
			<div className="base-gate">
				<div className="title">
					<h1>Oh no!</h1>
					<p>You're NGMI. Click the button to try again</p>
				</div>
				<div className="btn">
					<button className="btn-primary">Get Access</button>
				</div>
			</div>
		)
	}

	// 200 http status, indicates success
	if (httpStatus2 === 200) {
		return (
			<div className="base-gate">
				<div className="title">
					<h1>Congrats!</h1>
					<p>You made it. Click the button to connect to your token gate</p>
				</div>
				<div className="btn">
					<button className="btn-primary">Get Access</button>
				</div>
			</div>
		)
	}

	// all else, return loading
	return <Loading/>
}


// BaseGate component
// handles rendering base on state
const BaseGate = () => {
	const { id, json, step, httpStatus } = useContext(TokenGateContext);

	// initial http status is 0, indicates loading
	if (httpStatus === 0){
		return <Loading/>
	}

	// non-200 http status, indicates error
	if (httpStatus !== 200) {
		return <Error/>
	}

	// 200 http status, indicates success
	// delegate to tokengate step
	if (httpStatus === 200) {
		// Step 0
		// Initial Get Access
		if (step === 0){
		return (
			<InitialGate/>
		)}

		// Step 1
		// Select Wallet || Sign Message
		if (step === 1){
		return (
			<Web3Login/>
		)}


		// Step 2
		// json2 response
		if (step === 2){
		return (
			<Reward/>
		)}
	}



	return <Loading/>
}


// GateHandler, updates on ID change
// Fetches & Sets TokenGate JSON, then passes da
const GateHandler = () => {
	const { id, json, gateType, setGateType, setJson, httpStatus, setHttpStatus } = useContext(TokenGateContext);

	useEffect(() => {
		(async function() {
			// check for ID string before
			if (typeof id === 'string' && id.length > 0){
				// set status to initial status (0)
				setHttpStatus(0);

				// fetch and set API response
				const TokenGateRetrieveInstance = new TokenGateRetrieve()
				const response = await TokenGateRetrieveInstance.call(id);
				console.log('api response', response)
				if (response && response.httpStatus){
					setJson(response);
					setHttpStatus(response.httpStatus);
				}
			}
		})();
	},[id]);

	useEffect(() => {
		if (httpStatus === 200){
			setGateType(json?.general_type);
		}
	},[json, httpStatus]);

	return (
		<StyledContainer gateType={gateType}>
			<BaseGate/>
		</StyledContainer>
	)
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
				<GateHandler/>
			</Web3ProviderWrapper>
		</TokenGateProvider>
	);
}

export default TokenGate;
