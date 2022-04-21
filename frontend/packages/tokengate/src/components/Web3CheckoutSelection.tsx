import React, { useContext, useEffect, useState } from 'react';
import { TokenGateRequestAccess } from '../api';
import { TokenGateContext } from '../context';
import { Loading } from "./";

const CheckoutSelection = ({checkout_options}) => {
	return checkout_options.map(function(item, index){
		return (
		<div>
			<h3>{item.options.result[0].name}</h3>
			<div>{item.options.result[0].symbol}</div>
			<small>{item.options.result[0].token_address}</small>
			<div>
				{
					item.options.result.map((option, index) => {
						return (
							<button>
								<li>Token ID: {option.token_id}</li>
							</button>
						)
					})
				}
			</div>
		</div>
		)
	})
}


export const Web3CheckoutSelection = ({accountData}:{accountData:any}) => {
	const {
		id,
		retrieveJson,
		gateType,
		requestAccessJson,
		setRequestAccessJson,
		setRequestAccessError,
	} = useContext(TokenGateContext);

	// useEffect hook to request access (based on web3 account data change)
	useEffect(() => {
		(async function() {
			let response: any;
			if (accountData && accountData.address){
				response = await TokenGateRequestAccess.call(id, gateType, 'blockchain', accountData.address)
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRequestAccessJson(response);
					} else {
						console.log('????')
						setRequestAccessError(response);
					}
				}
			}
			})();
	},[accountData?.address]);

	// requestAccessJson
	if (requestAccessJson){
		return (
			<div>
				<div className="base-inside">
					<h1>Checkout Options</h1>
					<p>Select which assets you want to verify for access</p>
				</div>
				<div className="web3-checkout-options">
					<CheckoutSelection checkout_options={requestAccessJson.checkout_options}/>
				</div>
			</div>
		)
	}

	// default, loading
	return <Loading/>

}
