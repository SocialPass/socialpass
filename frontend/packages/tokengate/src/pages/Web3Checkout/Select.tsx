import React, { useContext, useEffect, useState } from 'react';
import {  useAccount } from 'wagmi';
import { useNavigate } from "react-router-dom";
import { TokenGateRequestAccess } from '../../api';
import { TokenGateContext } from '../../context';
import { Loading } from '../../components/Loading';

// Checkout selection component
// Renders form with options by their asset requirements
const CheckoutSelection = ({checkoutOptions, limit, web3CheckoutSelection, setWeb3CheckoutSelection}) => {
	const add_checkout_selection = (requirement, option) => {
		setWeb3CheckoutSelection(oldArray => [...oldArray, {
			"requirement": requirement,
			"option": option
		}]);
	}

	return checkoutOptions.map(function(item, index){
		return (
		<div>
			<h3>{item.options.result[0].name}</h3>
			<div>{item.options.result[0].symbol}</div>
			<small>{item.options.result[0].token_address}</small>
			<div>
				{
					item.options.result.map((option, index) => {
						if (web3CheckoutSelection.length < limit){
							return (
								<button onClick={() => add_checkout_selection(item.requirement, option)}>
									<li>Token ID: {option.token_id}</li>
								</button>
							)
						}
						return (
							<button disabled>
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


// Web3CheckoutSelection
export const Web3CheckoutSelection = () => {
	const navigate = useNavigate();
	const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();
	const {
		id,
		retrieveJson,
		requestAccessJson,
		setRequestAccessJson,
		setRequestAccessError,
		web3CheckoutSelection,
		setWeb3CheckoutSelection
	} = useContext(TokenGateContext);

	// useEffect hook to request access (based on web3 account data change)
	useEffect(() => {
		(async function() {
			let response: any;
			if (accountData && accountData.address){
				response = await TokenGateRequestAccess.call(id, retrieveJson.general_type, 'blockchain', accountData.address)
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

	if (requestAccessJson){
		return (
			<div className="base-gate">
				<div className="base-inside">
					<h1>Checkout Options</h1>
					<p>Select which assets you want to verify for access</p>
					<p>
						{web3CheckoutSelection.length} / {retrieveJson.limit_per_person} claimed
					</p>
				</div>
				<div className="web3-checkout-options">
					<CheckoutSelection
						limit={retrieveJson.limit_per_person}
						checkoutOptions={requestAccessJson.checkout_options}
						web3CheckoutSelection={web3CheckoutSelection}
						setWeb3CheckoutSelection={setWeb3CheckoutSelection}
					/>
				</div>
				<div className="base-inside">
					{web3CheckoutSelection.length > 0
						?
						(
							<button onClick={() => navigate('/checkout/web3/confirm')}>Confirm</button>
						)
						:
						(
							<button disabled>Select more options</button>
						)
					}
				</div>
			</div>
		)
	}

	// default, loading
	return <Loading/>

}
