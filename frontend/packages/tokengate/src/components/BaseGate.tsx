import React from 'react';
import { TokenGateContext } from '../context';

// BaseGate component
export const BaseGate = ({navigateTo}:{navigateTo:any}): JSX.Element => {
	const { retrieveJson } = React.useContext(TokenGateContext);
	return (
		<div className="base-gate">
			{retrieveJson &&
				<div className="team-info">
					<img src={retrieveJson?.team.image} alt="Team Image"/>
					<h4>{retrieveJson?.team.name}</h4>
				</div>
			}
			<div className="title">
				<h1>{retrieveJson.title}</h1>
				<p>{retrieveJson.description}</p>
			</div>
			<div className="btn">
				<button className="btn-primary" onClick={() => navigateTo()}>Get Access</button>
			</div>
		</div>
	)
}
