/*
API Interface for @nfty/sdk <> nfty django
*/
import {
	GateType,
	APIFetchError,
	TicketGateFetchResponse,
	AidropGateFetchResponse
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

function generateBaseObj(json:any){
	return {
	  "httpStatus": 200,
	  "title": json.title,
	  "description": json.description,
	  "requirements": json.requirements,
	  "signature": json.signature,
  }
}

/*
TicketGate
*/
function fetchTicketGate(id:string): Promise<APIFetchError> | Promise<TicketGateFetchResponse> {
	// set base response object and assign additional type-specific properties
	return fetch(`${process.env.REACT_APP_API_URL}/ticketgates/${id}/?format=json`).then((response) => {
	  if (response.ok) {
		return response.json();
	  } else {
		  throw response;
	  }
	})
	.then((json) => {
		let obj = generateBaseObj(json);
		return obj as TicketGateFetchResponse;
	})
	.catch((error) => {
	  let e = {
		  "httpStatus": error.status,
		  "message": error.json()
	  }
	  return e as APIFetchError;
	});
}

/*
AirdropGate
*/
function fetchAirdropGate(id:string): Promise<APIFetchError> | Promise<AidropGateFetchResponse > {
	return fetch(`${process.env.REACT_APP_API_URL}/airdropgates/${id}/?format=json`).then((response) => {
	  if (response.ok) {
		return response.json();
	  } else {
		  throw response;
	  }
	})
	.then((json) => {
		// set base response object and assign additional type-specific properties
		let obj = generateBaseObj(json);
		Object.assign(obj, {
			"asset_address": json.asset_address,
			"asset_type": json.asset_type,
			"chain": json.chain,
			"end_date": json.end_date,
		})
		return obj as AidropGateFetchResponse;
	})
	.catch((error) => {
		let e = {
			"httpStatus": error.status,
			"message": error.json()
		}
	    return e as APIFetchError;
	});
}
