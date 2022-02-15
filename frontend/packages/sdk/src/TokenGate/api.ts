/*
API Interface for @nfty/sdk <> nfty django
*/
import { GateType, APIError, TicketGateResponse, AidropGateResponse } from './props';


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
function fetchTicketGate(id:string): Promise<APIError> | Promise<TicketGateResponse> {
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
	   return obj as AidropGateResponse;
	})
	.catch((error) => {
	  return error as APIError;
	});
}

/*
AirdropGate
*/
function fetchAirdropGate(id:string): Promise<APIError> | Promise<AidropGateResponse > {
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
	  return obj as AidropGateResponse;
	})
	.catch((error) => {
		let e = {
			"httpStatus": error.status,
			"message": error.statusText
		}
	  return e as APIError;
	});
}
