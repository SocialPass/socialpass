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
  json: any //TBD
  setJson: any //TBD
}

// Props for base TokenGate API response
export interface BaseTokenGateResponse {
  id: string
  title: string
  description: string
  general_type: string
  requirements: any
  gateType: GateType
}

// Extended props for TicketGate
export interface TicketGateResponse extends BaseTokenGateResponse {
  name: string
  age: string
}

// Extended props for TicketGate
export interface AidropGateResponse extends BaseTokenGateResponse {
  name: string
  age: string
}
