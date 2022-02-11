/*
API Interface for @nfty/sdk <> nfty django
*/
import {GateType} from './props';

/*
Shared
*/
interface TokenGateResponse {
	id: string
	title: string
	description: string
	general_type: string
	requirements: any
}


/*
Gate Handler
*/
export function fetchGateHandler({id, gateType}:{id:string, gateType:GateType}){
	switch(gateType){
		case 'AIRDROP':
			return fetchAirdropGate({id});
		case 'TICKET':
			return fetchTicketGate({id});
		default:
			return console.log(`${gateType} coming soon`)
	}
}

/*
TicketGate
*/
interface TicketGateResponse extends TokenGateResponse {
	name: string
	age: string
}
function fetchTicketGate({id}:{id:string}): void | Promise<TicketGateResponse[]> {
	// For now, consider the data is stored on a static `users.json` file
	return fetch('/users.json')
		// the JSON body is taken from the response
		.then(res => {
			if (res.ok){
				return res.json();
			}
		})
		.then(res => {
			// The response has an `any` type, so we need to cast
			// it to the `User` type, and return it from the promise
			return res as TicketGateResponse[]
		})
}


/*
AirdropGate
*/
interface AidropGateResponse extends TokenGateResponse {
	name: string
	age: string
}
function fetchAirdropGate({id}:{id:string}): Promise<AidropGateResponse[]> {
	console.log(id)

	// For now, consider the data is stored on a static `users.json` file
	return fetch(`api/airdropgates/${id}`, {
		mode: 'cors',
	})
		// the JSON body is taken from the response
		.then(res => res.json())
		.then(res => {
				// The response has an `any` type, so we need to cast
				// it to the `User` type, and return it from the promise
				return res as AidropGateResponse[]
		})
}
