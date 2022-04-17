import React from 'react';
import { TokenGateContext } from '../context';

// BaseGate component
export const BaseGate = (): JSX.Element => {
	const { retrieveJson, setCheckoutType } = React.useContext(TokenGateContext);
	console.log('hello')
	return (
		<div className="base-gate">
			<div className="image">
				<img src={retrieveJson.team_image} alt="Team Image"/>
				<h3>{retrieveJson.team_name}</h3>
			</div>
			<div className="title">
				<h1>{retrieveJson.title}</h1>
				<p>{retrieveJson.description}</p>
			</div>
			<div className="btn">
				<button className="btn-primary" onClick={() => setCheckoutType('BLOCKCHAIN')}>Get Access</button>
			</div>
		</div>
	)
}
