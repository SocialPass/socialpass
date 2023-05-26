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

async function connectWallet(connector) {
	// Connect wallet
	const result = await connect({
		connector:connector,
	});

	// #1: Wallet is connected
	if(result.account){
		// TODO:
		return
	}

	// add watchAccount for account changes, disconnects, etc.
	watchAccount((account) => {
		console.log('watching....');
		if (account.address){
			console.log(account.address)
			// TODO: #2 Wallet address has changed
			// Wallet is connected; hide wallet buttons and show disconnect button
			return
		}
		if (!account.address){
			console.log('disconnected...')
			disconnectWallet();
		}
	});
}

export async function disconnectWallet() {
	await disconnect();
	// TODO: #3 wallet is disconnected
	// Wallet is disconnected; show wallet buttons and hide disconnect button
}

export async function signWallet(message) {
	// Sign message
	console.log('signing...')
	const signature = await signMessage({
		message: message,
	});

	// Set signed message if available
	// Else throw error
	console.log(signature)
	if (signature){
		document.getElementById("id_signed_message").value = signature;
	} else {
		// TODO: SHOW ERROR TO USER, PROMPT TO SIGN AGAIN
		return
	}
}
function setupWallets(){
	// Setup globals, attach onClick listeners, etc.
	config.args.connectors.forEach(function(connector) {
		// Add onClick
		if (connector.ready){
			console.log(connector, 'ready', )
			  // Get the button element
			  const button = document.getElementById(connector.id);

			  // Add an event listener to the button (optional)
			  button.addEventListener('click', function() {
				connectWallet(connector)
			  });
		}

		// TODO:
		// Disable or hide wallet connector as not 'ready', or available in current environment
		else {

		}
	});
}



// Setup globals, etc.
setupWallets();
window.signWallet = signWallet;
window.disconnectWallet = disconnectWallet;