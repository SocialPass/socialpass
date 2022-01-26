import React from 'react';
import { Provider } from 'wagmi'

interface TokenGateProps {
	type?: string
	provider?: any
}

interface TokenGateProps {
	provider?: any
	children?: any
}

// Conditionally provide WAGMI provider
// If 'provider' is provided, then just render children
const ProviderHandler: React.FC<TokenGateProps> = ({provider, children}) => {
	if (provider === undefined){
		return (
			<Provider>
				{children}
			</Provider>
		)
	}
	return (
		<>
			{children}
		</>
	)
}

// Conditionally render TokenGate component based on type
// Based on 'type' provided, import/use other components in this directory
const TokenGateHandler: React.FC<TokenGateProps> = ({type, children}) => {
	return (
		<>
		TGHandler: {type}
		</>
	)
}


const TokenGate: React.FC<TokenGateProps> = ({ type, provider }) => {
	return (
		<ProviderHandler provider={provider}>
			<TokenGateHandler type={type}/>
		</ProviderHandler>
	);
}

export default TokenGate;
