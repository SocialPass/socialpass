import metamaskActive from "../static/images/connectors/metamask-active.svg";
import walletconnectActive from "../static/images/connectors/walletconnect-active.svg";
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
