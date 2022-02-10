enum GateType {
  TICKET = "TICKET",
  AIRDROP = "AIRDROP"
  DISCORD = "DISCORD"
  TELEGRAM = "TELEGRAM"
}

export interface TokenGateContextInterface {
  id: string // ID of tokengate
  gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
  step: number
  setStep: any
  json: any
  setJson: any
}

export interface TokenGateProviderInterface {
	id: string // ID of tokengate
	gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
  children?: any
}
