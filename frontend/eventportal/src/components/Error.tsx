import React, { useContext } from 'react';
import { EventPortalContext } from '../context';

// Error Component
// todo
export const Error = ({statusCode, message}) => {
	return (
		<div>
			<h1>Error</h1>
			<h2>Status Code</h2>
		</div>
	)
}
