import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { publicProvider } from "@wagmi/core/providers/public";
import { watchAccount } from "@wagmi/core";
import {
	configureChains,
	createConfig,
	signMessage,
	mainnet,
} from "@wagmi/core";
import { createWeb3Modal, walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'

// Constants
const projectId = "e52d8ed47789f1f007851fd6faf4850b";

// 2. Configure wagmi client, metadata, & config
const { chains, publicClient } = configureChains([mainnet], [
  walletConnectProvider({ projectId }),
  publicProvider()
])
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
	new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
	new EIP6963Connector({ chains }),
	new InjectedConnector({ chains, options: { shimDisconnect: true } }),
	new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
  ],
  publicClient
})
// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains })


export function signWallet(message, event) {
	event.preventDefault();

	// Remove error messages
	document
		.getElementById("wallet-address-error-message")
		.classList.add("d-none");
	document
		.getElementById("wallet-signature-error-message")
		.classList.add("d-none");

	// Wallet address
	if (document.getElementById("id_wallet_address").value === "") {
		document
			.getElementById("wallet-address-error-message")
			.classList.remove("d-none");
		return;
	}

	// Sign message
	try {
		const signature = signMessage({
			message: message,
		});
		document.getElementById("id_signed_message").value = signature;
	} catch (e) {
		document.getElementById("id_signed_message").value = "";
	}
	if (document.getElementById("id_signed_message").value === "") {
		document
			.getElementById("checkout-submit-btn")
			.removeAttribute("disabled");
		document.getElementById("checkout-submit-btn").innerHTML =
			'<strong class="antialiased">Get Tickets</strong>';
		document
			.getElementById("wallet-signature-error-message")
			.classList.remove("d-none");
	} else {
		document
			.getElementById("checkout-submit-btn")
			.setAttribute("disabled", "disabled");
		document.getElementById("checkout-submit-btn").innerHTML =
			'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
		document.getElementById("asset_ownership_form").submit();
	}
}
window.signWallet = signWallet;

// Setup watch account (used for grabbing wallet address)
watchAccount((account) => {
	if (account.address) {
		document.getElementById("id_wallet_address").value = account.address;
	}
	// #3 Wallet has disconnected
	if (!account.address) {
		document.getElementById("id_wallet_address").value = "";
	}
});