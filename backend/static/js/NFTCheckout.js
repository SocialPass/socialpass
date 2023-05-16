import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import {
	configureChains,
	connect,
	createConfig,
	disconnect,
	fetchEnsName,
	getAccount,
	mainnet,
	signMessage
} from '@wagmi/core'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet],
	[publicProvider()],
)

const config = createConfig({
	autoConnect: true,
	publicClient,
	webSocketPublicClient,
})

window.console.log(config);

export async function connectWallet() {
	// Connect wallet
	const result = await connect({
		connector: new InjectedConnector(),
	})
	const account = getAccount();
	console.log(result);
	console.log(account);
	document.getElementById("id_wallet_address").value = account.address;
}

export async function walletSign(message) {
	// Sign message
	const signature = await signMessage({
		message: 'gm wagmi frens',
	});
	console.log(signature)
	document.getElementById("id_signed_message").value = signature;
}

export async function disconnectWallet(message) {
	// Disconnect wallet
	await disconnect();
	document.getElementById("id_wallet_address").value = "";
	document.getElementById("id_signed_message").value = "";
}

window.connectWallet = connectWallet;
window.walletSign = walletSign;
window.disconnectWallet = disconnectWallet;
