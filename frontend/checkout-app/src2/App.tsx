import React from 'react'
import { WagmiConfig } from 'wagmi'
import { Web3Provider } from './providers/Web3Provider'
import Router from './Router'

export default function App() {
	return (
		<WagmiConfig client={Web3Provider}>
			<Router/>
		</WagmiConfig>
	)
}
