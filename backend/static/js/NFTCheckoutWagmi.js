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

const truncateAddress = (address) => {
	const beginning = address.substring(0, 5);
	const end = address.slice(address.length - 5);
	return `${beginning}...${end}`;
};

async function connectWallet(connector) {
	// Connect wallet
	const result = await connect({
		connector:connector,
	});

	// #1: Wallet is connected
	if(result.account){
		document.getElementById('connected-address').innerText = truncateAddress(result.account);
		document.getElementById('id_wallet_address').value = result.account;
		document.getElementById('disconnect').querySelector('img').setAttribute(
			'src',
			document.getElementById(result.connector.id).querySelector('img').getAttribute('src')
		);
		document.getElementById('connect-container').classList.add('d-none');
		document.getElementById('disconnect-container').classList.remove('d-none');
	}

	// add watchAccount for account changes, disconnects, etc.
	watchAccount((account) => {
		// #2 Wallet address has changed
		// Wallet is connected; hide wallet buttons and show disconnect button
		if (account.address){
			document.getElementById('connected-address').innerText = truncateAddress(account.address);
			document.getElementById('id_wallet_address').value = account.address;
			document.getElementById('disconnect').querySelector('img').setAttribute(
				'src',
				document.getElementById(account.connector.id).querySelector('img').getAttribute('src')
			);
			document.getElementById('connect-container').classList.add('d-none');
			document.getElementById('disconnect-container').classList.remove('d-none');
		}
		// #3 Wallet has disconnected
		if (!account.address){
			disconnectWallet();
		}
	});
}

export async function disconnectWallet() {
	await disconnect();
	document.getElementById('id_wallet_address').value = '';
	document.getElementById("id_signed_message").value = '';
	document.getElementById('connect-container').classList.remove('d-none');
	document.getElementById('disconnect-container').classList.add('d-none');
}

export async function signWallet(message) {
	// Remove error
	document
	.getElementById("wallet-signature-error-message")
	.classList.add("d-none");

	// Sign message
	try	{
		const signature = await signMessage({
			message: message,
		});
		document.getElementById("id_signed_message").value = signature;
		document.getElementById("asset-ownership-field").submit();
	} catch (e){
		document
		.getElementById("wallet-signature-error-message")
		.classList.remove("d-none");
	}


}
function setupWallets(){
	config.args.connectors.forEach(function(connector) {
		if (connector.ready){
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
			return
		}
	});
}

// Setup globals, etc.
setupWallets();
window.signWallet = signWallet;
window.disconnectWallet = disconnectWallet;