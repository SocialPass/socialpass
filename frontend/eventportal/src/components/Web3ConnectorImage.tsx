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
}: {
  connector: string | undefined;
}) => {
  switch (connector) {
    case "MetaMask":
      return <img height="64" width="64" src={metamaskActive} alt="image" />;
    case "WalletConnect":
      return (
        <img height="64" width="64" src={walletconnectActive} alt="image" />
      );
    case "Coinbase Wallet":
      return <img height="64" width="64" src={coinbaseActive} alt="image" />;
    default:
      return null;
  }
};
