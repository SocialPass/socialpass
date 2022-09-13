import React from 'react'
import Base from './pages/Base';
import Home from './pages/Home';
import { Routes, Route, BrowserRouter } from 'react-router-dom'

export default function Router(){
	return (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Base />} >
				<Route index element={<Home />} />
			</Route>
		</Routes>
	</BrowserRouter>
	)
}