import React from 'react'
import { WagmiConfig } from 'wagmi'
import { client } from './providers/web3'
import Router from './Router'

export default function App() {
	return (
		<WagmiConfig client={client}>
			<Router/>
		</WagmiConfig>
	)
}
