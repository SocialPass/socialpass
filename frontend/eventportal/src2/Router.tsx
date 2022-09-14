import React from 'react'
import Base from './pages/Base';
import Home from './pages/Home';
import Success from './pages/Success';
import Error from './pages/Error';
import WalletCheckout from './pages/WalletCheckout'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

export default function Router(){
	return (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Base />} >
				<Route index element={<Home />} />
				<Route path="error" element={<Error />} />
				<Route path="success" element={<Success />} />
				<Route path="checkout/wallet" element={<WalletCheckout />} />
			</Route>
		</Routes>
	</BrowserRouter>
	)
}