import React, { useContext, useEffect } from 'react';
import {  useAccount, useSignMessage } from 'wagmi';
import { useNavigate } from "react-router-dom";
import { TokenGateRequestAccess, TokenGateGrantAccess } from '../../api';
import { TokenGateContext } from '../../context';
import { Loading, Web3CheckoutSelection } from '../../components';


// Web3CheckoutSelection
export const Web3CheckoutConfirmation = () => {
	// tokengate context hooks
	const {
		id,
		retrieveJson,
		requestAccessJson,
		setRequestAccessJson,
		setRequestAccessError,
		web3CheckoutSelection,
		setWeb3CheckoutSelection,
		setGrantAccessJson,
		setGrantAccessError
	} = useContext(TokenGateContext);
	// navigation
	const navigate = useNavigate();
	// web3 account hooks
	const [{ data: accountData, error: accountError }, disconnect] = useAccount();
	// wallet signature hooks
	// setup with signature_message
	const [{data: signData, error: signError,loading: signLoading}, signMessage] =
	useSignMessage({
		message: requestAccessJson?.signature_message
	});

	// request access handler (based on web3 account data change)
	useEffect(() => {
		(async function() {
			let response: any;
			// api call
			if (accountData && accountData.address){
				response = await TokenGateRequestAccess.call({
					"public_id":id,
					"gate_type":retrieveJson.general_type,
					"access_type":'blockchain',
					"address":accountData.address
				});
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRequestAccessJson(response);
					} else {
						setRequestAccessError(response);
					}
				}
			}
		})();
	},[accountData?.address]);


	// checkout handler
	// handles signing message and posting related data to API
	useEffect(() => {
		(async function() {
			if (signData){
			let response;
				response = await TokenGateGrantAccess.call({
					'gate_type':retrieveJson.general_type,
					'public_id':id,
					'access_type':'blockchain',
					'address':accountData.address,
					'signed_message':signData,
					'signature_id':requestAccessJson.signature_id,
					'access_data':'access_data',
				})
				if (response.httpStatus === 200){
					setGrantAccessJson(response);
					//navigate(success)
				} else {
					setGrantAccessError(response);
					//navigate(error)
				}
			}
		})();
	},[signData]);

	// disconnect handler
	// useEffect hook to navigate back on wallet disconnect
	useEffect(() => {
		if (!accountData?.address){
			console.log('navigate');
			// navigate to wallet connection page
			navigate("/checkout/web3/connect");
		}
	}, [accountData?.address])


	if (signLoading){
		return <Loading/>
	}

	if (requestAccessJson){
		return (
			<div className="row">
				<div className="base-inside">
					<h1>Checkout Options</h1>
					<p>Select which assets you want to verify for access</p>
					<Web3CheckoutSelection
						limit={retrieveJson.limit_per_person}
						checkoutOptions={requestAccessJson.checkout_options}
						web3CheckoutSelection={web3CheckoutSelection}
						setWeb3CheckoutSelection={setWeb3CheckoutSelection}
					/>
				</div>
				<div className="base-inside">
					<p>
						{web3CheckoutSelection.length} / {retrieveJson.limit_per_person} claimed
					</p>
					{web3CheckoutSelection.length > 0
						?
						(
							<button className="btn-primary" onClick={() => signMessage()}>
								Confirm
							</button>
						)
						:
						(
							<button className="btn-primary" disabled>Select more options</button>
						)
					}
				</div>
			</div>
		)
	}

	// default, loading
	return <Loading/>

}
