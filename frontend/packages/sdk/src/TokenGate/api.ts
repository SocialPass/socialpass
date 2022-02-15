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
Gate Handler
*/
export async function fetchGateHandler({id}:{id:string}){
	let _id = id.split('_');
	switch(_id[0]){
		case 'AIRDROP':
			return await fetchAirdropGate(_id[1]);
		case 'TICKET':
			return await fetchTicketGate(_id[1]);
		default:
			return console.log(`could not route to proper API`)
	}

}

/*
TicketGate
*/
function fetchTicketGate(id:string): Promise<APIFetchError> | Promise<TicketGateFetchResponse> {
	return fetch(`${process.env.REACT_APP_API_URL}/ticketgates/${id}/?format=json`).then((response) => {
	  if (response.ok) {
		return response.json();
	  } else {
		  throw response;
	  }
	})
	.then((json) => {
	   let obj = {
		   "id": json.id,
		   "httpStatus": 200,
		   "title": json.title,
		   "description": json.description,
		   "general_type": json.general_type,
		   "requirements": json.requirements,
		 }
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
	  let obj = {
			//base
  			"id": json.id,
  			"httpStatus": 200,
  			"title": json.title,
  			"description": json.description,
  			"general_type": json.general_type,
  			"requirements": json.requirements,
			//airdrop
			"asset_address": json.asset_address,
			"asset_type": json.asset_type,
			"chain": json.chain,
			"end_date": json.end_date,
		}
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
