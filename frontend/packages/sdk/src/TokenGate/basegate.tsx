import React, { useContext } from 'react';
import { TokenGateContext } from './context';
import Web3ProviderAuthentication from "./web3/auth";

const BaseGate = () => {
	const { gateType, json, json2, step, setStep } = React.useContext(TokenGateContext);
	// Step 0
	// Initial Get Access
	if (step === 0){
	return (
		<div className="styled-base-gate">
			<div>
				<img src={json.team_image} alt="Team Image" height="25" width="25"/>
				<h3>{json.team_name}</h3>
				<h1>{json.title}</h1>
			</div>
			<div>
				<button onClick={() => setStep(1)}>Get Access</button>
			</div>
		</div>
	)}

	// Step 1
	// Select Wallet || Sign Message
	if (step === 1){
	return (
		<div className="styled-base-gate">
			<Web3ProviderAuthentication/>
		</div>
	)}


	// Step 2
	// json2 response
	if (step === 2){
	console.log(json2);
	return (
		<div className="styled-base-gate">
			JSON2 Response
		</div>
	)}

	return <></>

}

export default BaseGate;
