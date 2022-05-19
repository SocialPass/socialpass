import React, { useContext } from 'react';
import { EventPortalContext } from '../context';

/************************************* Logic COMPONENTS *************************************/
// Reward component
// Display reward screen (Success or failure)
export const Reward = () => {
	return (
		<div className="base-gate">
			<div className="title">
				<h1>Oh no!</h1>
				<p>You're NGMI. Click the button to try again</p>
			</div>
			<div className="btn">
				<button className="btn-primary">Get Access</button>
			</div>
		</div>
	)
}
