import { useEffect, useContext } from 'react';
import { EventPortalContext } from '../context';
import { TicketedEventRetrieve } from '../api';
import { useNavigate } from "react-router-dom";
import { Loading } from "../components";

// Root Page
// Fetches & Sets initial JSON, then navigate based on response
export const Init = () => {
	// context
	const { setID, retrieveJson, setRetrieveJson, setRetrieveError } = useContext(EventPortalContext);
	// navigation hook
	const navigate = useNavigate();
	// TODO: get id from path
	let id = window.location.pathname;
	id = id.replace('/','');
	useEffect(() => {
		(async function() {
				if (id !== '/'){
					const response = await TicketedEventRetrieve.call({"public_id":id});
					if (response && response.httpStatus){
						// success
						if (response.httpStatus === 200){
							setRetrieveJson(response);
							navigate('/ticketed-event');
						}
						// error
						else {
							setRetrieveError(response);
							navigate('/ticketed-event');
						}
					}
				}
			})();
	}, [])

	return <Loading loadingText="Fetching event data..."/>;
}
