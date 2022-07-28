import googleWalletIcon from "../../static/images/icons/gw-icon.svg";

export default function GoogleWalletButton() {
  return (
    <button className="btn-google-wallet d-flex align-items-center justify-content-start gap-5 mt-15">
      <img
        className="wallet-icon"
        src={googleWalletIcon}
        alt="google wallet icon"
      />
      <div>
        <span className="d-block fs-12 text-start">Add to</span> Google Wallet
      </div>
    </button>
  );
}
