import React from 'react';

// ConnectorImage
// Return image based on connector props
export const Web3ConnectorImage = ({connector}:{connector:string|undefined}) => {
	switch(connector){
		case 'MetaMask':
			return <img height="72" width="72" src={require("../static/images/connectors/metamask.svg")} alt="image"/>
		case 'WalletConnect':
			return <img src={require("../static/images/connectors/walletconnect.svg")} alt="image"/>
		case 'Coinbase Wallet':
			return <img src={require("../static/images/connectors/coinbase-wallet.svg")} alt="image"/>
		default:
			return null;
	}
}
