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
		setBackButton,
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
	const [{ data: accountData, loading: accountLoading, error: accountError }, disconnect] = useAccount();
	// wallet signature hooks
	// setup with signature_message
	const [{data: signData, error: signError,loading: signLoading}, signMessage] =
	useSignMessage({
		message: requestAccessJson?.signature_message
	});

	// useEffect hook to set back button and its side effects
	useEffect(() => {
		const back_button = () => {
			disconnect();
			setWeb3CheckoutSelection([]);
			navigate(-1);
		}
		setBackButton(() => back_button);
	},[])

	// request access handler (based on web3 account data change)
	useEffect(() => {
		(async function() {
			setRequestAccessJson(null);
			setRequestAccessError(null);
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
			console.log(web3CheckoutSelection)
				response = await TokenGateGrantAccess.call({
					'gate_type':retrieveJson.general_type,
					'public_id':id,
					'access_type':'blockchain',
					'address':accountData.address,
					'signed_message':signData,
					'signature_id':requestAccessJson.signature_id,
					'access_data':web3CheckoutSelection,
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
			// navigate to wallet connection page
			navigate("/checkout/web3/connect");
		}
	}, [accountData?.address])


	if (signLoading){
		return <Loading loadingText='Verifying checkout selections and eligibility'/>
	}

	if (accountLoading){
		return <Loading loadingText='Loading account data'/>
	}

	if (requestAccessJson){
		return (
			<div className="row flex-grow-1 m-0 mt-2">
				<div className="col-md-7">
					<h2>Select Your Asset(s)</h2>
					<p>Select the asset(s) you would like to redeem your Token Gate with</p>
					<Web3CheckoutSelection
						checkoutOptions={requestAccessJson.checkout_options}
						web3CheckoutSelection={web3CheckoutSelection}
						setWeb3CheckoutSelection={setWeb3CheckoutSelection}
					/>
				</div>
				<div style={{background: '#FBFBFB'}} className="col-md-5 pt-3 d-flex flex-column">
					<p>
						{web3CheckoutSelection.length} / {retrieveJson.limit_per_person} claimed
					</p>
					<div>
					{
						web3CheckoutSelection
						? <div>Select assets</div>
						: <div>Select assets</div>
					}
					</div>
					{web3CheckoutSelection.length > 0
						?
						(
							<button className="btn-primary mt-auto" onClick={() => signMessage()}>
								Confirm
							</button>
						)
						:
						(
							<button className="btn-primary mt-auto" disabled>Select more options</button>
						)
					}
				</div>
			</div>
		)
	}

	return <Loading loadingText="Gathering Your Eligible NFTS"/>
}
