import { useEffect, useContext } from 'react';
import { TokenGateContext } from '../context';
import { TokenGateRetrieve } from '../api';
import { useNavigate } from "react-router-dom";

// Root Page
// Fetches & Sets initial JSON, then navigate based on response
export const Init = () => {
	const { id, setRetrieveJson, setRetrieveError } = useContext(TokenGateContext);
	const navigate = useNavigate();

	useEffect(() => {
		(async function() {
			// check for ID string on start
			if (typeof id === 'string' && id.length > 0){
				const response = await TokenGateRetrieve.call({
					"public_id":id
				});
				if (response && response.httpStatus){
					if (response.httpStatus === 200){
						setRetrieveJson(response);

						// navigate based on gate type
						switch(response?.general_type){
							case('TICKET'):
								navigate('/gate/ticket')
						}
					} else {
						setRetrieveError(response);
					}
				}
			}
		})();
	},[id]);

	return null;
}
