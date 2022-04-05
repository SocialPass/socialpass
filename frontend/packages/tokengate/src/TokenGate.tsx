import React, { useState, useEffect, useContext } from 'react';
import Web3ProviderWrapper from './web3/wrapper';
import { Web3Login } from "./web3/login";
import { TokenGateProviderInterface } from './props';
import { TokenGateProvider, TokenGateContext } from './context';
import { fetchGateHandler } from './api';
import './index.css';


// TickerImage component
const TickerImage = ({gateType}) => {
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
const Error = ({httpStatus}) => {
	return (
		<div>
			<h1>Error</h1>
			<h2>Status Code: {httpStatus}</h2>
		</div>
	)
}

// Status Wrapper
// Once httpStatus is 200, rendering is handed off to BaseGate
const Status = ({httpStatus, id, json, setGateType}) => {
	// initial http status is 0, indicates loading
	if (httpStatus === 0){
		return <Loading/>
	}

	// non-200 http status, indicates error
	if (httpStatus !== 200) {
		return <Error httpStatus={httpStatus}/>
	}

	// 200 http status, indicates success
	// return base gate and set gate type
	if (httpStatus === 200) {
		setGateType(json.general_type)
		return <BaseGate/>
	}

	return <Loading/>
}

// StyledContainer component
//
const StyledContainer = ({children, gateType}) => {
	return (
		<div className="container">
			<header>
				<TickerImage gateType={gateType}/>
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
	const { gateType, json, json2, step, setStep } = React.useContext(TokenGateContext);
	// Step 0
	// Initial Get Access
	if (step === 0){
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
	console.log(json2);
	return (
		<div className="base-gate">
			JSON2 Response
		</div>
	)}

	return <></>
}

// GateHandler
const GateHandler = () => {
	const { id, json, gateType, setGateType, setJson, httpStatus, setHttpStatus } = useContext(TokenGateContext);

	// Gate Handler, updates on ID change
	// Fetches & Sets TokenGate JSON
	useEffect(() => {
		(async function() {
			// set status to initial status (0)
			setHttpStatus(0);

			// fetch and set API response
			let response = await fetchGateHandler(id);
			if (response && response.httpStatus){
				setJson(response);
				setHttpStatus(response.httpStatus)
			}
		})();
	},[id]);

	return (
		<StyledContainer gateType={gateType}>
			<Status httpStatus={httpStatus} id={id} json={json} setGateType={setGateType}/>
		</StyledContainer>
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
