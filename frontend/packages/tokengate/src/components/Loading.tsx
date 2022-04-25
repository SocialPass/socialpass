import React from 'react';
import { TokenGateContext } from '../context';

// Loading Component
// todo
export const Loading = () => {
	console.log('loading')
	return (
		<div className="row d-flex align-items-center justify-content-center flex-grow-1">
			<div className="col-12 text-center">
				<h1>Loading...</h1>
			</div>
		</div>
	)
}
