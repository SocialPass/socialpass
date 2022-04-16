import React, { useContext } from 'react';
import { TokenGateContext } from '../context';

/************************************* Logic COMPONENTS *************************************/
// Reward component
// Display tokengate reward screen (Success or failure)
export const Reward = () => {
	const { json2, httpStatus2 } = useContext(TokenGateContext);

	// non-200 http status, indicates failure
	if (httpStatus2 !== 200 && httpStatus2 !== 0) {
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

	// 200 http status, indicates success
	if (httpStatus2 === 200) {
		return (
			<div className="base-gate">
				<div className="title">
					<h1>Congrats!</h1>
					<p>You made it. Click the button to connect to your token gate</p>
				</div>
				<div className="btn">
					<button className="btn-primary">Get Access</button>
				</div>
			</div>
		)
	}

	// all else, return loading
	return <Loading/>
}
