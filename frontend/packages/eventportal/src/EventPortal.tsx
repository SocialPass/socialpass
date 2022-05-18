import React from 'react';
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import { StyledContainer } from './components';
import { TokenGateProvider } from './context';
import { TokenGateProviderInterface } from './props';
import Web3ProviderWrapper from './web3/wrapper';
import {
	Init,
	TicketGate,
	Web3ConnectWallet,
	Web3CheckoutConfirmation,
} from './pages';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
require<any>('./index.css');


// Main TokenGate component. Does a couple of things
// 1. Setup TokenGateProvider (react context)
// 2. Setup TokenGateProvider (react context)
// 3. Setup WAGMI web3 provider (need to make optional in future)
// 4. Renders GateHandler, which takes over token gate logic
// Takes in the following props:
// 1. ID: Public ID provided in SocialPass dashboard
// 2. Styles: Object used to configure styles (TBD)
const EventPortal = ({ id, styles }: TokenGateProviderInterface) => {
	return (
		<MemoryRouter>
			<base href="/"/> {/* set static asset to base path for relative imports */}
			<TokenGateProvider id={id} styles={styles}>
				<Web3ProviderWrapper>
					<StyledContainer>

						<Routes>
							<Route index element={<Init />} />
							<Route path="/gate/ticket" element={<TicketGate />} />
							<Route path="/checkout/web3/connect" element={<Web3ConnectWallet />} />
							<Route path="/checkout/web3/checkout" element={<Web3CheckoutConfirmation/>} />
						</Routes>

					</StyledContainer>
				</Web3ProviderWrapper>
			</TokenGateProvider>
		</MemoryRouter>
	);
}

export default EventPortal;
