/*
steps
0: Initial
1: Wallet Connected, Prompt for Signature
2: Success (After signature)
3. Failure (After Signature)
*/
export enum GateType {
  TICKET = "TICKET",
  AIRDROP = "AIRDROP",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
  LOADING = "LOADING"
}

/*
Context types
*/
// Intial Props for TokenGate component
export interface TokenGateProviderInterface {
	id: string
  children?: any
  styles?:any
}

// Props for TokenGate component context
export interface TokenGateContextInterface {
  id: string
  styles?: any
  gateType: any
  setGateType: any

  retrieveJson: any
  setRetrieveJson: any
  retrieveError: any
  setRetrieveError: any

  requestAccessJson: any
  setRequestAccessJson: any
  setRequestAccessError: any
  requestAccessError: any

  grantAccessJson: any
  setgGrantAccessJson: any
  grantAccessError: any
  setGrantAccessError: any
}

/*
API TYPES - Retrieve
*/
export interface TicketGateRetrievalResponse {
  asset_address: string
  asset_type: string
  chain: string
  end_date: string
}

export interface TokenGateRetrievalResponse {
  httpStatus: number
  title: string
  team_name: any
  team_image: any
  description: string
  general_type: string
  requirements: any
  // ticketing
  ticket?: TicketGateRetrievalResponse
}

export interface TokenGateRetrievalError {
  httpStatus: number
  message?: string
}


/*
API TYPES - Request Access
*/
export interface TicketGateRequestAccessResponse {}

export interface TokenGateRequestAccessResponse {
  httpStatus: number
  // ticketing
  ticket?: TicketGateRequestAccessResponse
}

export interface TokenGateRetrieveAccessError {
  httpStatus: number
  message?: string
}


/*
API TYPES - Grant Access
*/
export interface TicketGateGrantAccessResponse {}

export interface TokenGateGrantAccessResponse {
  httpStatus: number
  // ticketing
  ticket?: TicketGateGrantAccessResponse
}

export interface TokenGateGrantAccessError {
  httpStatus: number
  message?: string
}
