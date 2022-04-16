import React, { useContext } from 'react';
import { TokenGateContext } from '../context';

// Error Component
// todo
export const Error = () => {
	const { httpStatus } = useContext(TokenGateContext);
	return (
		<div>
			<h1>Error</h1>
			<h2>Status Code: {httpStatus}</h2>
		</div>
	)
}
