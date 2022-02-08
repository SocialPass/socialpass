export interface TokenGateParentProps {
	id: number // ID of tokengate
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	provider?: any // [optional]: web3 provider
}

export interface TokenGateChildProps {
	json: any // JSON info of tokengate
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
}

export interface ProviderProps {
	children?: any
	provider?: any
}


export interface GateTypeSwitchProps {
	gateType: string // Type of tokengate: [TICKET, AIDRDROP, DISCORD, TELEGRAM]
	json: any
}
