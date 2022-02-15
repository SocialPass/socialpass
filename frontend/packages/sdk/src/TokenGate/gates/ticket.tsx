import React, { useContext } from 'react';
import { TokenGateContext } from '../context';
import Web3ProviderAuthentication from "../web3/auth";

const TicketGate = () => {
	const { id, json, step } = React.useContext(TokenGateContext)

	return (
		<>
		<h2>Ticket Gate</h2>
		<h3>Gate Info</h3>
		<ul>
			{json && Object.keys(json).map((keyName, i) => (
				<li className="travelcompany-input" key={i}>
					<span className="input-label">{keyName}: {json[keyName]}</span>
				</li>
			))}
		</ul>
		<Web3ProviderAuthentication/>
		</>
	)
}

export default TicketGate;
