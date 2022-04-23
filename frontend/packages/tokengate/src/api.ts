// TokenGateRetrieve class
// Used for retrieving any type of tokengate via .call()
export class TokenGateRetrieve {
	// wrapper for backend - TokenGateRetrieve
	static call = async ({public_id}) => {
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

// TokenGateRequestAccess class
// Used for requesting access to any tokengate
export class TokenGateRequestAccess {
	static call = async({gate_type, public_id, access_type, address}) => {
		let response: any;
		switch(gate_type){
			case('TICKET'):
				response = await TicketGateRequestAccess.call({
					'public_id':public_id,
					'access_type':access_type,
					'address':address
				});
				break;
			default:
				response = null;
		}
		return response;
	}
}

// TicketGateRequestAccess class
// Used for requesting access to a TicketGate
export class TicketGateRequestAccess {
	// wrapper for backend - TicketGateRequestAccess
	static call = async ({public_id, access_type, address}) => {
		// set url
		const url = `${process.env.REACT_APP_API_URL}/api/ticketgates/request-access/${public_id}?type=${access_type}`

		// set body
		const body = JSON.stringify({
			  "address": address
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
					"httpStatus": 200,
					"signature_id": json.signature_id,
					"signature_message": json.signature_message,
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

// TokenGateRequestAccess class
// Used for requesting access to any tokengate
export class TokenGateGrantAccess {
	static call = async({gate_type, public_id, access_type, address, signed_message, signature_id, access_data}) => {
		let response: any;
		switch(gate_type){
			case('TICKET'):
				response = await TicketGateGrantAccess.call({
					'public_id':public_id,
					'access_type':access_type,
					'address':address,
					'signed_message':signed_message,
					'signature_id':signature_id,
					'access_data':access_data,
				});
				break;
			default:
				response = null;
		}
		return response;
	}
}

// TicketGateGrantAccess class
// Used for granting access to a TicketGate
export class TicketGateGrantAccess {
	// wrapper for backend - TicketGateRequestAccess
	static call = async ({public_id, access_type, address, signed_message, signature_id, access_data}) => {
		// setup url
		const url = `${process.env.REACT_APP_API_URL}/api/ticketgates/grant-access/${public_id}?type=${access_type}`

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
