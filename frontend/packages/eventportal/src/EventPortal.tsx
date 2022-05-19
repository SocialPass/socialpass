import React from 'react';
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import { StyledContainer } from './components';
import { EventPortalProvider } from './context';
import { EventPortalProviderInterface } from './types';
import Web3ProviderWrapper from './web3/wrapper';
import {
	Init,
	TicketedEvent,
	Web3ConnectWallet,
	Web3CheckoutConfirmation,
} from './pages';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
require<any>('./index.css');


// Main EventPortal component. Does a couple of things
// 1. Setup EventPortalProvider (react context)
// 2. Setup WAGMI web3 provider (need to make optional in future)
// 3. Setup Routes, which takes over logic handling
// Takes in the following props:
// 1. ID: Public ID provided in SocialPass dashboard
// 2. Styles: Object used to configure styles (TBD)
const EventPortal = ({ id, styles }: EventPortalProviderInterface) => {
	return (
		<MemoryRouter>
			<base href="/"/> {/* set static asset to base path for relative imports */}
			<EventPortalProvider id={id} styles={styles}>
				<Web3ProviderWrapper>
					<StyledContainer>
						<Routes>
							<Route index element={<Init />} />
							<Route path="/gate/ticket" element={<TicketedEvent />} />
							<Route path="/checkout/web3/connect" element={<Web3ConnectWallet />} />
							<Route path="/checkout/web3/checkout" element={<Web3CheckoutConfirmation/>} />
						</Routes>
					</StyledContainer>
				</Web3ProviderWrapper>
			</EventPortalProvider>
		</MemoryRouter>
	);
}

export default EventPortal;
