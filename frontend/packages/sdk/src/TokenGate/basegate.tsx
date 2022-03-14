import React, { useContext } from 'react';
import { TokenGateContext } from './context';
import Web3ProviderAuthentication from "./web3/auth";

const BaseGate = () => {
	const { gateType, json, json2, step, setStep } = React.useContext(TokenGateContext);

	// Step 0
	// Initial Get Access
	if (step === 0){
	return (
		<div style={{display:'flex', justifyContent: 'space-between'}}>
			<div style={{display:'flex', flexDirection:'column'}}>
				<img src={json.team_image} alt="Team Image"/>
				<h3>{json.team_name}</h3>
				<h1>{json.title}</h1>
			</div>
			<button onClick={() => setStep(1)}>Get Access</button>
		</div>
	)}

	// Step 1
	// Select Wallet || Sign Message
	if (step === 1){
	return (
		<div style={{display:'flex', justifyContent: 'space-between'}}>
			<Web3ProviderAuthentication/>
		</div>
	)}


	// Step 2
	// json2 response
	if (step === 2){
	console.log(json2);
	return (
		<div style={{display:'flex', justifyContent: 'space-between'}}>
			JSON2 Response
		</div>
	)}

	return <></>

}

export default BaseGate;
