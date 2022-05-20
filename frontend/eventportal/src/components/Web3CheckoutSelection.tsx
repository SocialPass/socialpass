import React from 'react';

const Tabs = ({checkoutOptions}) => {
	return (
		<ul className="nav nav-tabs" id="myTab" role="tablist">
		{
			checkoutOptions.map((item, checkoutIndex) => {
			if(item.options.length > 0){
				return (
				<li className="nav-item" role="presentation">
					<button className={checkoutIndex === 0 ? 'nav-link active' : 'nav-link'} id={`tab-${checkoutIndex}-tab`} data-bs-toggle="tab" data-bs-target={`#tab-${checkoutIndex}`} role="tab" aria-controls={`tab-${checkoutIndex}`} aria-selected="true">Asset Name</button>
				</li>
				)
			}
			else {
				return (
					<li className="nav-item" role="presentation">
						<button className="nav-link disabled" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" role="tab" aria-controls="home" aria-selected="true">Asset Name</button>
					</li>
				)
			}
		})
		}
		</ul>

	)
}

const TabBody = ({checkoutOptions, addRemoveCheckoutSelection}) => (
	<div className="tab-content" id="myTabContent">

		{
		checkoutOptions.map((item, checkoutIndex) => (
			<form className={checkoutIndex === 0 ? 'tab-pane active' : 'tab-pane'} id={`tab-${checkoutIndex}`} role="tabpanel" aria-labelledby={`tab-${checkoutIndex}-tab`}>
				{
					item.options.length > 0 && item.options.map((optionItem, optionIndex) =>
						<div>
							<input onClick={(e) => addRemoveCheckoutSelection(e, optionItem, item.requirement)} type="checkbox" id={`for-${optionIndex}`} name={`for-${optionIndex}`}/>
							<label htmlFor={`for-${optionIndex}`}> Token ID: {optionItem.token_id}</label>
						</div>
					)
				}
			</form>
		))
		}
	</div>
)

// Checkout selection component
// Renders form with options by their asset requirements
export const Web3CheckoutSelection = ({checkoutOptions, web3CheckoutSelection, setWeb3CheckoutSelection}) => {

	// function to remove web3 checkout selection
	const removeCheckoutSelection = (option, requirement) => {
		setWeb3CheckoutSelection(web3CheckoutSelection.filter(function(selection) {
			return selection['option'] !== option
		}));
	}

	// function to add web3Checkout selection
	const addCheckoutSelection = (option, requirement) => {
		setWeb3CheckoutSelection(oldArray => [...oldArray, {
			"requirement": requirement,
			"option": option
		}]);
	}

	// function to add & remove web3Checkout selection
	const addRemoveCheckoutSelection = (e, option, requirement) => {
		const checked = e.target.checked;
		if (checked) {
			console.log('add')
			addCheckoutSelection(option, requirement);
		} else {
			console.log('remove')
			removeCheckoutSelection(option, requirement);
		}
	}

	console.log(web3CheckoutSelection)

	return (
		<div>
			<Tabs checkoutOptions={checkoutOptions} />
			<TabBody checkoutOptions={checkoutOptions} addRemoveCheckoutSelection={addRemoveCheckoutSelection}/>
		</div>
	)
}
