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


// Generate json2 object based on token gate access
function generateJson2Obj(){
	let reward : any[] = [];
	return {
		"httpStatus": 200,
		"reward": reward
	}
}

export class TokenGateRetrieve {
	// Generate json1 object based on token gate retrieval
	generate_json(json:any){
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

	// wrapper for backend - TokenGateRetrieve
	call(public_id:str): APIRetrievalError | TicketGateRetrievalResponse {
		// set url
		const url = `${process.env.REACT_APP_API_URL}/tokengates/retrieve/${public_id}/`

		// set request options
		var requestOptions = {
	  	method: 'GET',
	  	redirect: 'follow'
		};

		return fetch(url, requestOptions)
	  	.then(response => response.json())
	  	.then(json => {
	  		let obj = this.generate_json(json);
	  		Object.assign(obj, {
				"date": json.date,
				"location": json.location,
				"capacity": json.capacity,
				"deadline": json.deadline
	  		})
			console.log(obj)
			return obj
	  	})
	  	.catch(error => console.log('error', error));
	}
}

// wrapper for backend - TicketGateRequestAccess
function ticketGateRequestAccess(public_id:str, type:str){
	// set url
	const url = `${process.env.REACT_APP_API_URL}/ticketgates/request-access/${public_id}?type=${str}/`

	// set request options
	const requestOptions = {
  	method: 'POST',
  	body: '', // empty body
  	redirect: 'follow'
	};

	// fetch
	return fetch(url, requestOptions)
  	.then(response => response.text())
  	.then(result => console.log(result))
  	.catch(error => console.log('error', error));
}

// wrapper for backend - TicketGateRequestAccess
function ticketGateGrantAccess(){
	// setup url
	const url = `${process.env.REACT_APP_API_URL}/ticketgates/grant-access/${public_id}?type=${str}/`

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
  	body: body, // empty body
  	redirect: 'follow'
	};

	// fetch
	return fetch(url, requestOptions)
  	.then(response => response.text())
  	.then(result => console.log(result))
  	.catch(error => console.log('error', error));
}
