import React from 'react'
import { WagmiConfig } from 'wagmi'
import { Web3Provider } from './contexts/Web3Provider'
import Router from './routes/index'

export default function App() {
	return (
		<WagmiConfig client={Web3Provider}>
			<Router/>
		</WagmiConfig>
	)
}
