import React from 'react';

// Checkout selection component
// Renders form with options by their asset requirements
export const Web3CheckoutSelection = ({checkoutOptions, limit, web3CheckoutSelection, setWeb3CheckoutSelection}) => {
	const add_checkout_selection = (requirement, option) => {
		setWeb3CheckoutSelection(oldArray => [...oldArray, {
			"requirement": requirement,
			"option": option
		}]);
	}


	// available
	return checkoutOptions.map(function(item, index){
		if (item.options.result.length > 0){
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
		} else {
			return (
				<div>
					<small>{item.requirement.asset_address}</small>
					<div>
						No matching assets found
					</div>
				</div>
			)
		}

	})
}
