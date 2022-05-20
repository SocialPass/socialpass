import { useEffect, useContext } from 'react';
import { EventPortalContext } from '../context';
import { TicketedEventRetrieve } from '../api';
import { useNavigate } from "react-router-dom";

// Root Page
// Fetches & Sets initial JSON, then navigate based on response
export const Init = () => {
	// context
	const { setID, setRetrieveJson, setRetrieveError } = useContext(EventPortalContext);
	// navigation hook
	const navigate = useNavigate();
	// TODO: get id from path
	let id = window.location.pathname;
	id = id.replace('/','');

	(async function() {
		if (id !== '/'){
			const response = await TicketedEventRetrieve.call({"public_id":id});
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

	return null;
}
