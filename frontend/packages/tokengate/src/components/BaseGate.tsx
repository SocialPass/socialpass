import React from 'react';
import { TokenGateContext } from '../context';

// BaseGate component
export const BaseGate = ({retrieveJson, navigateTo}:{retrieveJson:any, navigateTo:any}): JSX.Element => {
	return (
		<div className="row">
			<div className="base-inside">
				<h1>{retrieveJson.title}</h1>
				<p>{retrieveJson.description}</p>
			</div>
			<div className="base-inside">
				<button className="btn-primary" onClick={() => navigateTo()}>Get Access</button>
			</div>
		</div>
	)
}
