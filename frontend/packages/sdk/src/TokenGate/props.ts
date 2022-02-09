enum GateType {
  TICKET = "TICKET",
  AIRDROP = "AIRDROP"
  DISCORD = "DISCORD"
  TELEGRAM = "TELEGRAM"
}

export interface TokenGateParentProps {
	id: string // ID of tokengate
	gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
}

export interface TokenGateChildProps {
	json: any // JSON info of tokengate
	gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	step: number
	setStep: any
}

export interface ProviderAuthProps {
	json: any // JSON info of tokengate
	gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	step: number
	setStep: any
}

export interface ProviderHandlerProps {
	children: any
}


export interface GateTypeSwitchProps {
	gateType: GateType // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	json: any // JSON info of tokengate
}
