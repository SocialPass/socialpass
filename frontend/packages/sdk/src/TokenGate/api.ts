/*
API Interface for @nfty/sdk <> nfty django
*/
import {
	GateType,
	APIRetrievalError,
	TicketGateRetrievalResponse,
	AidropGateRetrievalResponse
} from './props';


/*
General
*/
export async function fetchGateHandler({id}:{id:string}){
	let _id = id.split('_');
	switch(_id[0]){
		case 'AIRDROP':
			return await fetchAirdropGate(id);
		case 'TICKET':
			return await fetchTicketGate(id);
		default:
			return console.log(`could not route to proper API`)
	}

}

export async function accessGateHandler({address, tokengate_id, signature_id, signed_message}:{address: string, tokengate_id: string, signature_id: string, signed_message: string}){
	let _id = tokengate_id.split('_');
	switch(_id[0]){
		case 'AIRDROP':
			return await accessAirdropGate(address, tokengate_id, signature_id, signed_message);
		case 'TICKET':
			return await accessTicketGate(address, tokengate_id, signature_id, signed_message);
		default:
			return console.log(`could not route to proper API`)
	}

}

function generateJson1Obj(json:any){
	return {
	  "httpStatus": 200,
	  "title": json.title,
	  "description": json.description,
	  "requirements": json.requirements,
	  "signature": json.signature,
  }
}

function generateJson2Obj(json:any){
	return json
}

/*
TicketGate Retrieval
*/
function fetchTicketGate(id:string): Promise<APIRetrievalError> | Promise<TicketGateRetrievalResponse> {
	// set base response object and assign additional type-specific properties
	return fetch(`${process.env.REACT_APP_API_URL}/ticketgates/retrieve/${id}/?format=json`).then((response) => {
	  if (response.ok) {
		return response.json();
	  } else {
		  throw response;
	  }
	})
	.then((json) => {
		let obj = generateJson1Obj(json);
		return obj as TicketGateRetrievalResponse;
	})
	.catch((error) => {
	  let e = {
		  "httpStatus": error.status,
		  "message": error.json()
	  }
	  return e as APIRetrievalError;
	});
}

/*
TicketGate Access
*/
function accessTicketGate(address: string, tokengate_id: string, signature_id: string, signed_message: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var urlencoded = new URLSearchParams();
	urlencoded.append("address", address);
	urlencoded.append("tokengate_id", tokengate_id);
	urlencoded.append("signature_id", signature_id);
	urlencoded.append("signed_message", signed_message);

	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: urlencoded,
	};

	return fetch(`${process.env.REACT_APP_API_URL}/ticketgates/access/`, requestOptions)
	  .then((response) => {
		if (response.ok) {
		  return response.json();
		} else {
			throw response;
		}
	  })
	  .then((json) => {
		  let obj = generateJson2Obj(json);
		  return obj;
	  })
	  .catch((error) => {
		let e = {
			"httpStatus": error.status,
			"message": error.json()
		}
		return e as APIRetrievalError;
	  });
}

/*
AirdropGate Retrieval
*/
function fetchAirdropGate(id:string): Promise<APIRetrievalError> | Promise<AidropGateRetrievalResponse > {
	return fetch(`${process.env.REACT_APP_API_URL}/airdropgates/retrieve/${id}/?format=json`).then((response) => {
	  if (response.ok) {
		return response.json();
	  } else {
		  throw response;
	  }
	})
	.then((json) => {
		// set base response object and assign additional type-specific properties
		let obj = generateJson1Obj(json);
		Object.assign(obj, {
			"asset_address": json.asset_address,
			"asset_type": json.asset_type,
			"chain": json.chain,
			"end_date": json.end_date,
		})
		return obj as AidropGateRetrievalResponse;
	})
	.catch((error) => {
		let e = {
			"httpStatus": error.status,
			"message": error.json()
		}
	    return e as APIRetrievalError;
	});
}

/*
AirdropGate Access
*/
function accessAirdropGate(address: string, tokengate_id: string, signature_id: string, signed_message: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var urlencoded = new URLSearchParams();
	urlencoded.append("address", address);
	urlencoded.append("tokengate_id", tokengate_id);
	urlencoded.append("signature_id", signature_id);
	urlencoded.append("signed_message", signed_message);

	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: urlencoded,
	};

	return fetch(`${process.env.REACT_APP_API_URL}/airdropgates/access/`, requestOptions)
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			throw response;
		}
	})
	.then((json) => {
		let obj = generateJson2Obj(json);
		return obj;
	})
	.catch((error) => {
		let e = {
			"httpStatus": error.status,
			"message": error.json()
		}
		return e as APIRetrievalError;
	});
}
