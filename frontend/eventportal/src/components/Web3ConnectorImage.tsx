import React from 'react';
import metamask from "../static/images/connectors/metamask.svg";
import walletconnect from "../static/images/connectors/walletconnect.svg";
import coinbase from "../static/images/connectors/coinbase-wallet.svg";

// ConnectorImage
// Return image based on connector props
export const Web3ConnectorImage = ({connector}:{connector:string|undefined}) => {
	switch(connector){
		case 'MetaMask':
			return <img height="72" width="72" src={metamask} alt="image"/>
		case 'WalletConnect':
			return <img src={walletconnect} alt="image"/>
		case 'Coinbase Wallet':
			return <img src={coinbase} alt="image"/>
		default:
			return null;
	}
}
