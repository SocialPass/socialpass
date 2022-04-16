import React from 'react';
import { TokenGateContext } from '../context';

// BaseGate component
export const BaseGate = ({children}:{children:any}): JSX.Element => {
	return (
		<div className="base-gate">
			{children}
		</div>
	)
}
