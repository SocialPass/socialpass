import React from 'react';
import { TokenGateContext } from '../context';

// Loading Component
// todo
export const Loading = () => {
	console.log('loading')
	return (
		<div className="row">
			<div className="base-inside">
				<h1>Loading...</h1>
			</div>
		</div>
	)
}
