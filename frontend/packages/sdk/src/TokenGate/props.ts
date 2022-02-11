export enum GateType {
  TICKET = "TICKET",
  AIRDROP = "AIRDROP",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM"
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
	gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
  children?: any // Children of provider (main application)
  styles?:any  // Styles of tokengate
}
