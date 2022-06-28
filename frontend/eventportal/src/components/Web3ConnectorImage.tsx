import metamask from "../static/images/connectors/metamask.svg";
import metamaskActive from "../static/images/connectors/metamask-active.svg";
import walletconnectActive from "../static/images/connectors/walletconnect-active.svg";
import walletconnect from "../static/images/connectors/walletconnect.svg";
import coinbase from "../static/images/connectors/coinbase-wallet.svg";
import coinbaseActive from "../static/images/connectors/coinbase-active.svg";

// ConnectorImage
// Return image based on connector props
export const Web3ConnectorImage = ({
  connector,
  selectedWallet,
}: {
  connector: string | undefined;
  selectedWallet: any;
}) => {
  switch (connector) {
    case "MetaMask":
      if (connector === selectedWallet?.name) {
        return <img height="64" width="64" src={metamaskActive} alt="image" />;
      }
      return <img height="64" width="64" src={metamask} alt="image" />;
    case "WalletConnect":
      if (connector === selectedWallet?.name) {
        return (
          <img height="64" width="64" src={walletconnectActive} alt="image" />
        );
      }
      return <img height="64" width="64" src={walletconnect} alt="image" />;
    case "Coinbase Wallet":
      if (connector === selectedWallet?.name) {
        return <img height="64" width="64" src={coinbaseActive} alt="image" />;
      }
      return <img height="64" width="64" src={coinbase} alt="image" />;
    default:
      return null;
  }
};
