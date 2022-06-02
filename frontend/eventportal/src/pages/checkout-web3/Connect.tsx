import React, { useEffect, useContext } from "react";
import { useConnect, useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { Web3ConnectorImage } from "../../components/Web3ConnectorImage";
import { EventPortalContext } from "../../context";
import infoButton from "../../static/images/icons/infoButton.svg";

// ConnectorWallets
// Return UI for wallet connectors
export const Web3ConnectWallet = () => {
  const { setBackButton, generalAdmissionSelect } =
    useContext(EventPortalContext);
  const navigate = useNavigate();
  const [
    { data: connectData, error: connectError, loading: loadingConnect },
    connect,
  ] = useConnect();
  const [
    { data: accountData, error: accountError, loading: accountLoading },
    disconnect,
  ] = useAccount();

  // useEffect hook to set back button and its side effects
  useEffect(() => {
    const back_button = null;
    setBackButton(() => back_button);
  }, []);

  // navigate to checkout once account data i sloaded
  useEffect(() => {
    if (accountData?.address) {
      navigate("/checkout/web3/checkout");
    }
  }, [accountData?.address]);

  function handleNavigateBack() {
    navigate(-1);
  }

  function handleCheckTokens() {
    navigate("/checkout/status");
  }

  if (connectData) {
    return (
      <div className="d-flex flex-row flex-grow-1 justify-content-between">
        <div className="d-flex flex-column">
          <div>
            <h3 className="fs-20">Completer Checkout</h3>
            <p>Select from one of the checkout options below</p>
          </div>
          <div className="d-flex flex-row align-items-start justify-content-between">
            <div>
              <div className="d-flex flex-row align-items-center me-15">
                <span className="fs-18 fw-bold me-15">Checkout option</span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-start align-items-center mt-15 gap-30">
            <div className="border-color-primary px-30 rounded-3">
              <div className="fw-bold fs-15">Proof of NFT Ownership</div>
              <span>Select from the crypto wallet options</span>
            </div>
            <span
              className="fs-20"
              data-toggle="tooltip"
              data-placement="top"
              title="Proof of ownership is not an NFT trade. We need to prove you own the NFT in order to get the ticket. "
            >
              <img src={infoButton} />
            </span>
          </div>
          <div className="col-lg-12 d-flex mt-30 gap-15">
            {connectData.connectors.map((x) => (
              <button
                className="btn btn-secondary border-color-primary shadow-none d-flex flex-column align-items-center justify-content-around w-100 mt-3"
                disabled={!x.ready}
                key={x.id}
                onClick={() => connect(x)}
              >
                <Web3ConnectorImage connector={x.name} />
                {x.name}
                {!x.ready && " (unsupported)"}
              </button>
            ))}
          </div>
          {connectError && (
            <div>{connectError?.message ?? "Failed to connect"}</div>
          )}
        </div>
        <div className="bg-gray d-flex flex-column justify-start-center">
          <div className="d-flex flex-column align-items-start justify-start-center p-30">
            <div className="d-flex align-items-center justify-conent-center">
              <h3 className="fs-20">Summary</h3>
              <a
                onClick={handleNavigateBack}
                className="ms-15 mt-5 text-edit fs-15 fw-bold"
              >
                Edit
              </a>
            </div>
            <div className="d-flex flex-row">
              <p>{generalAdmissionSelect} X General Admission Ticket</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center p-30 mt-50">
            <button
              onClick={handleCheckTokens}
              className="btn btn-primary fs-20 text-capitalize rounded-3"
            >
              continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
