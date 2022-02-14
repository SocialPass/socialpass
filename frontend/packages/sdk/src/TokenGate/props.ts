export enum GateType {
  TICKET = "TICKET",
  AIRDROP = "AIRDROP",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
  LOADING = "LOADING"
}

/*
steps
0: Initial
1: Wallet Connected, Prompt for Signature
2: Success (After signature)
3. Failure (After Signature)
*/


export interface TokenGateProviderInterface {
	id: string // ID of tokengate
  children?: any // Children of provider (main application)
  styles?:any  // Styles of tokengate
}

export interface TokenGateContextInterface {
  id: string // ID of tokengate
  styles?: any // Styles of tokengate

  step: number // Step of token gate
  setStep: any // Set step of token gate

  json: any //TBD
  setJson: any //TBD
}
