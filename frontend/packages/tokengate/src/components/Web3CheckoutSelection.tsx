import React, { useContext, useEffect, useState } from 'react';
import { useMoralisWeb3Api } from "react-moralis";
import { TokenGateRequestAccess } from '../api';
import { TokenGateContext } from '../context';
import { Loading } from "../components";

export const Web3CheckoutSelection = ({accountData}:{accountData:any}) => {
	// tokengate context
	const { id,
		gateType,
		requestAccessError,
		requestAccessJson,
		setRequestAccessJson,
		setRequestAccessError,
	} = useContext(TokenGateContext);
	// local state
	const [ loading, setLoading ] = useState(false);

	// useEffect hook to request access (based on web3 account data change)
	useEffect(() => {
		(async function() {
			setLoading(true);
			let response: any;
			if (accountData && accountData.address){
				response = await TokenGateRequestAccess.call(id, gateType, 'blockchain', accountData.address)
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRequestAccessJson(response);
					} else {
						setRequestAccessError(response);
					}
				}
				setLoading(false);
			}
			})();
	},[accountData?.address]);

	// useEffect hook to setCheckoutOptions (based on requestAccessJson)
	useEffect(() => {
		console.log(requestAccessJson);
	}, [requestAccessJson])


	// loading
	if (loading === true){
		return <Loading/>
	}

	// requestAccessError
	// requestAccessJson

	return  (
		<h1>Web3 Checkout Selection</h1>
	)

}
