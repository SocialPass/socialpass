/*
API Interface for @socialpass/tokengate
*/
import {
	GateType,
	APIRetrievalError,
	TicketGateRetrievalResponse,
	APIAccessError,
	TicketGateAccessResponse
} from './props';


/*
General
*/
export async function fetchGateHandler({id}:{id:string}){
	let _id = id.split('_');
	switch(_id[0]){
		case 'TICKET':
			return await fetchTicketGate(id);
		default:
			return console.log(`could not route to proper API`)
	}

}

export async function accessGateHandler({address, tokengate_id, signature_id, signed_message}:{address: string, tokengate_id: string, signature_id: string, signed_message: string}){
	let _id = tokengate_id.split('_');
	switch(_id[0]){
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
	  "team_name": json.team.name,
	  "team_image": json.team.image,
	  "general_type": json.general_type,
	  "description": json.description,
	  "requirements": json.requirements,
	  "signature": json.signature,
  }
}

function generateJson2Obj(){
	let reward : any[] = [];
	return {
		"httpStatus": 200,
		"reward": reward
	}
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
		Object.assign(obj, {
			"date": json.date,
		  	"location": json.location,
		  	"capacity": json.capacity,
		  	"deadline": json.deadline
		})
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
function accessTicketGate(address: string, tokengate_id: string, signature_id: string, signed_message: string): Promise<APIAccessError> | Promise<TicketGateAccessResponse> {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var body = JSON.stringify({
		"address": address,
		"tokengate_id": tokengate_id,
		"signature_id": signature_id,
		"signed_message": signed_message,
	})

	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: body,
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
		let response = [];
		let obj = generateJson2Obj();
		for (let i in json){
			obj.reward.push(json[i])
		}
		return obj as TicketGateAccessResponse;
	  })
	  .catch((error) => {
		let e = {
			"httpStatus": error.status,
			"message": error
		}
		return e as APIAccessError;
	  });
}
