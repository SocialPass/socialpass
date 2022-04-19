// TokenGateRetrieve class
// Used for retrieving any type of tokengate via .call()
export class TokenGateRetrieve {
	// wrapper for backend - TokenGateRetrieve
	static call = async (public_id:string) => {
		// set url
		const url = `${process.env.REACT_APP_API_URL}/api/tokengates/retrieve/${public_id}/`

		// set request options
		var requestOptions = {
	  		method: 'GET',
		};

		return fetch(url, requestOptions)
	  	.then(response => response.json())
	  	.then(json => {
	  		let obj = json;
	  		Object.assign(obj, {
				"httpStatus": 200,
				"date": json.date,
				"location": json.location,
				"capacity": json.capacity,
				"deadline": json.deadline
	  		})
			return obj
	  	})
	  	.catch(error => {
			  let e = {
					"httpStatus": error.status,
					"message": error.json()
				}
			  return e;
		  });
	}
}

// TicketGateRequestAccess class
// Used for requesting access to a TicketGate
const generate_ticketgate_requestaccess_json = (json:any) => {
	return {
	  "httpStatus": 200,
	  "signature_id": json.signature_id,
	  "signature_message": json.signature_message,
  }
}

export class TicketGateRequestAccess {
	// wrapper for backend - TicketGateRequestAccess
	static call = async (public_id:string, type:string) => {
		// set url

		const url = `${process.env.REACT_APP_API_URL}/api/ticketgates/request-access/${public_id}?type=${type}`

		// set request options
		const requestOptions = {
			  method: 'POST',
			  body: '', // empty body
		};

		// fetch
		return fetch(url, requestOptions)
			.then(response => response.json())
			.then(json => {
				let obj = generate_ticketgate_requestaccess_json(json);
				Object.assign(obj, {
				})
			  return obj
			})
			.catch(error => {
				let e = {
					  "httpStatus": error.status,
					  "message": error.json()
				  }
				return e;
			});
	  }
}


// TicketGateGrantAccess class
// Used for granting access to a TicketGate
export class TicketGateGrantAccess {
	// wrapper for backend - TicketGateRequestAccess
	static call = async (
		public_id:string,
		type:string,
		address:string,
		signed_message:string,
		signature_id:string,
		access_data:any
	) => {
		// setup url
		const url = `${process.env.REACT_APP_API_URL}/api/ticketgates/grant-access/${public_id}?type=${type}`

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
			  body: body,
			  headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
		};

		// fetch
		return fetch(url, requestOptions)
		.then(response => response.json())
		.then(json => {
			let obj = json;
			Object.assign(obj, {
			})
		  return obj
		})
		.catch(error => {
			let e = {
				  "httpStatus": error.status,
				  "message": error.json()
			  }
			return e;
		});
	}
}
