/*
API Interface for @socialpass/tokengate
*/
import {
	APIRetrievalError,
	TicketGateRetrievalResponse,
} from './props';

// TokenGateRetrieve class
// Used for retrieving any type of tokengate via .call()
export class TokenGateRetrieve {
	// wrapper for backend - TokenGateRetrieve
	static call = async (public_id:string): Promise<APIRetrievalError | TicketGateRetrievalResponse> => {
		// generate json method
		const generate_json = (json:any) => {
			return {
			  "httpStatus": 200,
			  "title": json.title,
			  "team_name": json.team.name,
			  "team_image": json.team.image,
			  "general_type": json.general_type,
			  "description": json.description,
			  "requirements": json.requirements,
		  }
		}

		// set url
		const url = `${process.env.REACT_APP_API_URL}/tokengates/retrieve/${public_id}/`

		// set request options
		var requestOptions = {
	  		method: 'GET',
		};

		return fetch(url, requestOptions)
	  	.then(response => response.json())
	  	.then(json => {
	  		let obj = generate_json(json);
	  		Object.assign(obj, {
				"date": json.date,
				"location": json.location,
				"capacity": json.capacity,
				"deadline": json.deadline
	  		})
			console.log(obj)
			return obj as TicketGateRetrievalResponse
	  	})
	  	.catch(error => {
			  let e = {
					"httpStatus": error.status,
					"message": error.json()
				}
			  return e as APIRetrievalError;
		  });
	}
}

// TokenGateRequestAccess class
// Used for requesting access to a TicketGate
export class TokenGateRequestAccess {
	// wrapper for backend - TicketGateRequestAccess
	static ticketGateRequestAccess = async (public_id:string, type:string) => {
		// set url
		const url = `${process.env.REACT_APP_API_URL}/ticketgates/request-access/${public_id}?type=${type}/`

		// set request options
		const requestOptions = {
			  method: 'POST',
			  body: '', // empty body
		};

		// fetch
		return fetch(url, requestOptions)
			  .then(response => response.text())
			  .then(result => console.log(result))
			  .catch(error => console.log('error', error));
	}
}

// TokenGateGrantAccess class
// Used for granting access to a TicketGate
export class TokenGateGrantAccess {
	// wrapper for backend - TicketGateRequestAccess
	static ticketGateGrantAccess = async (
		public_id:string,
		type:string,
		address:string,
		signed_message:string,
		signature_id:string,
		access_data:any
	) => {
		// setup url
		const url = `${process.env.REACT_APP_API_URL}/ticketgates/grant-access/${public_id}?type=${type}/`

		// set body
		const body = JSON.stringify({
			  "address": address,
			  "signed_message": signed_message,
			  "signature_id": signature_id,
			  "access_data": access_data
		});

		// set request options
		const requestOptions = {
			  method: 'POST',
			  body: body
		};

		// fetch
		return fetch(url, requestOptions)
		  .then(response => response.text())
		  .then(result => console.log(result))
		  .catch(error => console.log('error', error));
	}
}
