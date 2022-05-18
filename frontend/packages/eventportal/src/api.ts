// EventPortalRetrieve class
// Used for retrieving any type of tokengate via .call()
export class EventPortalRetrieve {
	// wrapper for backend - EventPortalRetrieve
	static call = async ({public_id}) => {
		// set url
		const url = `${process.env.REACT_APP_API_URL}/api/event-portal/retrieve/${public_id}/`

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

// EventPortalRequestAccess class
// Used for requesting access to a EventPortal
export class EventPortalRequestAccess {
	// wrapper for backend - EventPortalRequestAccess
	static call = async ({public_id, access_type, address}) => {
		// set url
		const url = `${process.env.REACT_APP_API_URL}/api/event-portal/request-access/${public_id}?type=${access_type}`

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

// EventPortalGrantAccess class
// Used for granting access to a EventPortal
export class EventPortalGrantAccess {
	// wrapper for backend - EventPortalRequestAccess
	static call = async ({public_id, access_type, address, signed_message, signature_id, access_data}) => {
		// setup url
		const url = `${process.env.REACT_APP_API_URL}/api/event-portal/grant-access/${public_id}?type=${access_type}`

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
				"httpStatus": 200,
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
