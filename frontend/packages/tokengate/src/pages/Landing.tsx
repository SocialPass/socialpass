import { useEffect, useContext } from 'react';
import { TokenGateContext } from '../context';
import { TokenGateRetrieve } from '../api';
import { useNavigate } from "react-router-dom";

// Root Page
// Fetches & Sets initial JSON, then navigate based on response
export const Landing = () => {
	const { id, setRetrieveJson, setGateType, setRetrieveError } = useContext(TokenGateContext);
	const navigate = useNavigate();

	useEffect(() => {
		(async function() {
			navigate('/loading-gate');
			// check for ID string before
			if (typeof id === 'string' && id.length > 0){
				const response = await TokenGateRetrieve.call(id);
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRetrieveJson(response);
						setGateType(response?.general_type);

						// navigate based on gate type
						switch(response?.general_type){
							case('TICKET'):
								navigate('/ticket-gate')
						}
					} else {
						setRetrieveError(response);
					}
				}
			}
		})();
	},[id]);

	return null
}
