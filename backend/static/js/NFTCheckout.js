import { InjectedConnector } from '@wagmi/core/connectors/injected'
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
		new CoinbaseWalletConnector({
		  options: {
			appName: 'socialpass.io',
			//jsonRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/yourAlchemyId',
		  },
		}),
		new InjectedConnector(),
		new LedgerConnector({
		  chains: chains,
		}),
		new MetaMaskConnector(),
		new SafeConnector({
		  chains,
		  options: {
			allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
			debug: false,
		  },
		}),
		new WalletConnectConnector({
		  options: {
			projectId: '...',
		  },
		}),
	],
	publicClient,
	webSocketPublicClient,
})

async function connectWallet(connector) {
	// Connect wallet
	const result = await connect({
		connector:connector,
	})
	const account = getAccount();
	console.log(result);
	console.log(account);
	//document.getElementById("id_wallet_address").value = account.address;
}

export function setupWallets(){
	// get container
	const container = document.getElementById("buttons-container");

	// Iterate over the list and create buttons
	config.args.connectors.forEach(function(connector) {
	  console.log(connector)
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
	});

	// Add Wallet Address Listener
	watchAccount((account) => {
		console.log('watching account', account)
		if (!account.address){
			disconnectWallet()
		}
		// TODO:
		// Update wallet address HTML value on change
	});
}

export async function walletSign(message) {
	console.log('signing...')
	// Sign message
	const signature = await signMessage({
		message: message,
	});
	console.log(signature)
	//document.getElementById("id_signed_message").value = signature;
}

export async function disconnectWallet() {
	// Disconnect wallet
	console.log('disconnecting...')
	await disconnect();
	//document.getElementById("id_wallet_address").value = "";
	//document.getElementById("id_signed_message").value = "";
}


// Setup globals, etc.
window.walletSign = walletSign;
window.disconnectWallet = disconnectWallet;
setupWallets()