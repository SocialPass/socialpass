import React from 'react';
import { TokenGateContext } from '../context';

// Loading Component
// todo
export const Loading = ({loadingText}) => {
	return (
		<div className="row d-flex align-items-center justify-content-center flex-grow-1">
			<div className="col-12 text-center">
				<div class="spinner-border text-dark" role="status">
				  <span class="visually-hidden">Loading...</span>
				</div>
				<div class="row">
				  <strong>{loadingText}</strong>
				  <p>Please wait, this might take a second</p>
				</div>
			</div>
		</div>
	)
}
