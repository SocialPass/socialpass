import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { LedgerConnector } from '@wagmi/connectors/ledger'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { SafeConnector } from '@wagmi/connectors/safe'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { publicProvider } from '@wagmi/core/providers/public'
import { watchAccount } from '@wagmi/core'
import {
	configureChains,
	connect,
	createConfig,
	disconnect,
	getAccount,
	signMessage,
	mainnet
} from '@wagmi/core'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet],
	[publicProvider()],
)

const config = createConfig({
	autoConnect: false,
	connectors: [
		new MetaMaskConnector(),
		new WalletConnectConnector({
		  options: {
			projectId: 'e52d8ed47789f1f007851fd6faf4850b',
		  },
		}),
		new CoinbaseWalletConnector({
		  options: {
			appName: 'socialpass.io',
			//jsonRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/yourAlchemyId',
		  },
		}),
		new SafeConnector({
		  chains,
		  options: {
			allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
			debug: false,
		  },
		}),
		new LedgerConnector({
		  chains: chains,
		}),
	],
	publicClient,
	webSocketPublicClient,
})

export function setupWalletDisplay(){
	// get/wipe container
	const container = document.getElementById("buttons-container");
	container.innerHTML = "";

	// Iterate over the list and create buttons
	config.args.connectors.forEach(function(connector) {
		if (connector.ready){
			// Create a button element
		  	const button = document.createElement('button');

		  	// Set the button's text content to the current item value
		  	button.textContent = connector.name;

		  	// Add an event listener to the button (optional)
		  	button.addEventListener('click', function() {
				connectWallet(connector)
		  	});

		  	// Append the button to the container
		  	container.appendChild(button);
		}
	});
}

export function setupConnectedDisplay(account){
	// get/wipe container
	const container = document.getElementById("buttons-container");
	container.innerHTML = "";

	// add disconnect button if needed
	const button = document.createElement('button');
	button.textContent = `Disconnect: ${account.address}`;
    button.addEventListener('click', function() {
		disconnectWallet();
  	});
  	container.appendChild(button);
}

export async function walletSign(message) {
	// Sign message
	console.log('signing...')
	const signature = await signMessage({
		message: message,
	});
	console.log(signature)
}

async function connectWallet(connector) {
	// Connect wallet
	const result = await connect({
		connector:connector,
	});
	const account = getAccount();

	// setup connected display
	if (account.address){
		setupConnectedDisplay(account)
	}

	// watch account for disconnects, etc.
	watchAccount((account) => {
		console.log('watching....');
		if (account.address){
			setupConnectedDisplay(account)
		}
		if (!account.address){
			disconnectWallet();
		}
	});
}

export async function disconnectWallet() {
	// Disconnect wallet
	await disconnect();

	// setup wallets
	setupWalletDisplay();
}


// Setup globals, etc.
setupWalletDisplay();
window.walletSign = walletSign;
window.disconnectWallet = disconnectWallet;