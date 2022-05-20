import React, { useContext } from 'react';
import { EventPortalContext } from '../context';

/************************************* Logic COMPONENTS *************************************/
// Reward component
// Display reward screen (Success or failure)
export const Reward = ({grantAccessJson}:{grantAccessJson}) => {
	console.log(grantAccessJson);
	return (
		<div className="row flex-grow-1 m-0 mt-3 align-items-center">
			<div className="col-md-7 mb-4 d-flex">
				<div className="col col-md-10">
					<h1>Congrats!</h1>
					<p>You made it! Click the button to download your ticket</p>
				</div>
			</div>
			<div className="col-md-5">
				<a className="btn btn-primary" target="_blank" href={grantAccessJson['0']}>
					Download Tickets
				</a>
			</div>
		</div>
	)
}
