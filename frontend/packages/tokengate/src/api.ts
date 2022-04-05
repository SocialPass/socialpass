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


// Generate json1 object based on token gate retrieval
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

// Generate json2 object based on token gate access
function generateJson2Obj(){
	let reward : any[] = [];
	return {
		"httpStatus": 200,
		"reward": reward
	}
}

// Retrieve Gate Handler
// Retrieves any type of tokengate (provided the ID) and assigns response object properties accordingly
// Notably, response object structure changes on `json.general_type`
export async function retrieveGateHandler(id:string): Promise<APIRetrievalError> | Promise<TicketGateRetrievalResponse> {
	try {
		let response = await fetch(`${process.env.REACT_APP_API_URL}/tokengates/retrieve/${id}/?format=json`);
		if (response.ok) {
			let json = await response.json();
			let obj = generateJson1Obj(json);
			switch(json.general_type){
				case 'TICKET':
					Object.assign(obj, {
						"date": json.date,
						  "location": json.location,
						  "capacity": json.capacity,
						  "deadline": json.deadline
					})
					return obj as TicketGateRetrievalResponse;
				default:
					return obj
			}
	  	} else {
		  	throw response;
	  	}
	}
	catch(error){
		let e = {
			  "httpStatus": error.status,
			  "message": error.json()
		  }
		return e as APIRetrievalError;
	}
}

// Access Gate Handler
// Accesses any type of token gate, depending on the provided `gateType`
export async function accessGateHandler({address, tokengate_id, signature_id, signed_message, gateType}:{address: string, tokengate_id: string, signature_id: string, signed_message: string, gateType: string}){
	switch(gateType){
		case 'TICKET':
			return await accessTicketGate(address, tokengate_id, signature_id, signed_message);
		default:
			return console.log(`could not route to proper API`)
	}

}

// Access Ticket Gate
function accessTicketGate(
	address: string,
	tokengate_id: string,
	signature_id: string,
	signed_message: string
): Promise<APIAccessError> | Promise<TicketGateAccessResponse> {
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
