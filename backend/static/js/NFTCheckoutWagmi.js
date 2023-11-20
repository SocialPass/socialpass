import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { LedgerConnector } from "@wagmi/connectors/ledger";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { publicProvider } from "@wagmi/core/providers/public";
import { watchAccount } from "@wagmi/core";
import {
	configureChains,
	connect,
	createConfig,
	disconnect,
	signMessage,
	mainnet,
} from "@wagmi/core";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet],
	[publicProvider()]
);

const config = createConfig({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector(),
		new WalletConnectConnector({
			options: {
				projectId: "e52d8ed47789f1f007851fd6faf4850b",
			},
		}),
		new CoinbaseWalletConnector({
			options: {
				appName: "socialpass.io",
				//jsonRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/yourAlchemyId',
			},
		}),
		new LedgerConnector({
			chains: chains,
		}),
	],
	publicClient,
	webSocketPublicClient,
});

const truncateAddress = (address) => {
	const beginning = address.substring(0, 5);
	const end = address.slice(address.length - 5);
	return `${beginning}...${end}`;
};

async function connectWallet(connector) {
	// Connect wallet
	const result = await connect({
		connector: connector,
	});

	// #1: Wallet is connected
	if (result.account) {
		document.getElementById("connected-address").innerText =
			truncateAddress(result.account);
		document.getElementById("id_wallet_address").value = result.account;
		document
			.getElementById("disconnect")
			.querySelector("img")
			.setAttribute(
				"src",
				document
					.getElementById(result.connector.id)
					.querySelector("img")
					.getAttribute("src")
			);
		document.getElementById("connect-container").classList.add("d-none");
		document
			.getElementById("disconnect-container")
			.classList.remove("d-none");
	}


}

export async function disconnectWallet() {
	await disconnect();
	document.getElementById("id_wallet_address").value = "";
	document.getElementById("id_signed_message").value = "";
	document.getElementById("connect-container").classList.remove("d-none");
	document.getElementById("disconnect-container").classList.add("d-none");
}

export async function signWallet(message, event) {
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
		const signature = await signMessage({
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

function setupWatchAccount(){
	// add watchAccount for account changes, disconnects, etc.
	watchAccount((account) => {
		// #2 Wallet address has changed
		// Wallet is connected; hide wallet buttons and show disconnect button
		if (account.address) {
			document.getElementById("connected-address").innerText =
				truncateAddress(account.address);
			document.getElementById("id_wallet_address").value =
				account.address;
			document
				.getElementById("disconnect")
				.querySelector("img")
				.setAttribute(
					"src",
					document
						.getElementById(account.connector.id)
						.querySelector("img")
						.getAttribute("src")
				);
			document
				.getElementById("connect-container")
				.classList.add("d-none");
			document
				.getElementById("disconnect-container")
				.classList.remove("d-none");
		}
		// #3 Wallet has disconnected
		if (!account.address) {
			disconnectWallet();
		}
	});
}

function setupWallets() {
	config.args.connectors.forEach(function (connector) {
		if (connector.ready) {
			// Get the button element
			const button = document.getElementById(connector.id);

			// Show the button and add an event listener to the button
			button.classList.remove("d-none");
			button.addEventListener("click", function () {
				connectWallet(connector);
			});
		}
		// TODO:
		// Disable or hide wallet connector as not 'ready', or available in current environment
		else {
			return;
		}
	});
}

// Setup globals, etc.
setupWallets();
setupWatchAccount();
window.signWallet = signWallet;
window.disconnectWallet = disconnectWallet;