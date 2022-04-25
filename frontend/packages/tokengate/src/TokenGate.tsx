import React from 'react';
import {
  unstable_HistoryRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { createBrowserHistory } from 'history'
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
require<any>('./index.css');


// setup browser history
let history = createBrowserHistory();
history.replace('/');

// Main TokenGate component. Does a couple of things
// 1. Setup TokenGateProvider (react context)
// 2. Setup TokenGateProvider (react context)
// 3. Setup WAGMI web3 provider (need to make optional in future)
// 4. Renders GateHandler, which takes over token gate logic
// Takes in the following props:
// 1. ID: Public ID provided in SocialPass dashboard
// 2. Styles: Object used to configure styles (TBD)
const TokenGate = ({ id, styles }: TokenGateProviderInterface) => {
	return (
		<Router history={history}>
			<base href="/"/> {/* set static asset to base path for relative imports */}
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
			</head>
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
		</Router>
	);
}

export default TokenGate;
