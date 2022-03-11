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

// Intial Props for TokenGate component
export interface TokenGateProviderInterface {
	id: string // ID of tokengate
  children?: any // Children of provider (main application)
  styles?:any  // Styles of tokengate
}

// Props for TokenGate component context
export interface TokenGateContextInterface {
  id: string // ID of tokengate
  styles?: any // Styles of tokengate
  gateType: any
  setGateType: any

  step: number // Step of token gate
  setStep: any // Set step of token gate

  // initial fetch tokengate
  json: any | APIRetrievalError | TokenGateRetrievalResponse | AidropGateRetrievalResponse
  setJson: any
  httpStatus: number
  setHttpStatus: any

  // verify tokengate
  json2: any
  setJson2: any
  httpStatus2: number
  setHttpStatus2: any
}

/*
API TYPES -- Retrieval TokenGates
*/
export interface APIRetrievalError {
  httpStatus: number
  message?: string
}

// Props for base TokenGate API response
export interface TokenGateRetrievalResponse {
  httpStatus: number
  title: string
  team_name: any
  team_image: any
  description: string
  general_type: string
  requirements: any
  signature: any
}

// Extended props for TicketGate
export interface TicketGateRetrievalResponse extends TokenGateRetrievalResponse {
  asset_address: string
  asset_type: string
  chain: string
  end_date: string
}

// Extended props for AirdropGate
export interface AidropGateRetrievalResponse extends TokenGateRetrievalResponse {
  date: any
  location: any
  capacity: any
  deadline: any
}



/*
API TYPES -- Access TokenGates
*/
export interface APIAccessError {
  httpStatus: number
  message?: string
}


// Props for base TokenGate API response
export interface TokenGateAccessResponse {
  httpStatus: number
  wallet_address: string
}

// Extended props for TicketGate
export interface AirdropGateAccessResponse extends TokenGateAccessResponse {
  transaction_hash: string
}

// Extended props for TicketGate
export interface TicketGateAccessResponse extends TokenGateAccessResponse {
  ticket_url: string
}
