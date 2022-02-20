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

  step: number // Step of token gate
  setStep: any // Set step of token gate

  // initial fetch tokengate
  json: APIFetchError | TokenGateFetchResponse | AidropGateFetchResponse
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
API TYPES -- Fetch TokenGates
*/
export interface APIFetchError {
  httpStatus: number
  message?: string
}

// Props for base TokenGate API response
export interface TokenGateFetchResponse {
  id: string
  httpStatus: number
  title: string
  description: string
  general_type: string
  requirements: any
}

// Extended props for TicketGate
export interface TicketGateFetchResponse extends TokenGateFetchResponse {
  asset_address: string
  asset_type: string
  chain: string
  end_date: string
}

// Extended props for TicketGate
export interface AidropGateFetchResponse extends TokenGateFetchResponse {

}


/*
API TYPES -- Verify TokenGates (json2)
*/
