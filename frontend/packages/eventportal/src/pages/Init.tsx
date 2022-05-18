import { useEffect, useContext } from 'react';
import { TokenGateContext } from '../context';
import { EventPortalRetrieve } from '../api';
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
				const response = await EventPortalRetrieve.call({
					"public_id":id
				});
				if (response && response.httpStatus){
					// success
					if (response.httpStatus === 200){
						setRetrieveJson(response);
						navigate('/gate/ticket')
					}
					// error
					else {
						setRetrieveError(response);
					}
				}
			}
		})();
	},[id]);

	return null;
}
