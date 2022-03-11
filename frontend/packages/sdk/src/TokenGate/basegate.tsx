import React, { useContext } from 'react';
import { TokenGateContext } from './context';
import Web3ProviderAuthentication from "./web3/auth";

const BaseGate = () => {
	const { gateType, json, step } = React.useContext(TokenGateContext);
	console.log(json)
	return (
		<div style={{display:'flex', justifyContent: 'space-between'}}>
			<div style={{display:'flex', flexDirection:'column'}}>
				<img src={json.team_image} alt="Team Image"/>
				<h3>{json.team_name}</h3>
				<h1>{json.title}</h1>
			</div>
			<Web3ProviderAuthentication/>
		</div>
	)
}

export default BaseGate;
