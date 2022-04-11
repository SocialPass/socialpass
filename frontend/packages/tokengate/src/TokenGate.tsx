import React, { useState, useCallback, useEffect, useContext } from 'react';
import {  useConnect, useAccount, useSignMessage } from 'wagmi'
import Web3ProviderWrapper from './web3/wrapper';
import { Web3Login } from "./web3/login";
import { TokenGateProviderInterface, GateType } from './props';
import { TokenGateProvider, TokenGateContext } from './context';
import { accessGateHandler, retrieveGateHandler } from './api';
import './index.css';

// TickerImage component
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
const Loading = () => {
	return (
		<h1>Loading...</h1>
	)
}

// Error Component
const Error = () => {
	const { httpStatus } = useContext(TokenGateContext);
	return (
		<div>
			<h1>Error</h1>
			<h2>Status Code: {httpStatus}</h2>
		</div>
	)
}


// Reward status wrapper
// Renders 1 of 2 (Success or failure)
const RewardStatus = () => {
	const { json2, httpStatus2 } = useContext(TokenGateContext);
	console.log('helloooo', json2, httpStatus2);

	// initial http status is 0, indicates loading
	if (httpStatus2 === 0){
		return <Loading/>
	}

	// non-200 http status, indicates error
	if (httpStatus2 !== 200) {
		return (
			<div className="base-gate">
				<div className="title">
					<h1>Oh no!</h1>
					<p>You're NGMI! Click the button to try again</p>
				</div>
				<div className="btn">
					<button className="btn-primary">Get Access</button>
				</div>
			</div>
		)
	}

	// 200 http status, indicates success
	// return base gate and set gate type
	if (httpStatus2 === 200) {
		return (
			<div className="base-gate">
				<div className="title">
					<h1>Congrats!</h1>
					<p>You made it! Click the button to connect to your token gate</p>
				</div>
				<div className="btn">
					<button className="btn-primary">Get Access</button>
				</div>
			</div>
		)
	}

	return <Loading/>
}


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

// Initial Status Wrapper
// Renders 1 of 3 statuses (Loading, Error, or BaseGate)
const InitialStatus = () => {
	const { id, json, gateType, httpStatus } = useContext(TokenGateContext);

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
		return <BaseGate/>
	}

	return <Loading/>
}

// StyledContainer component
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


const BaseGate = () => {
	const { step } = React.useContext(TokenGateContext);

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
		<RewardStatus/>
	)}

	return <></>
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
				let response = await retrieveGateHandler(id);
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
			<InitialStatus/>
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
