import { useEffect, useContext, useState } from "react";
import { useConnect, useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import { TicketedEventRequestAccess, TicketedEventGrantAccess } from "../api";
import { Loading } from "../components/";
import { Web3ConnectorImage } from "../components/Web3ConnectorImage";
import { CheckoutPortalContext } from "../context";

// ConnectorWallets
// Return UI for wallet connectors
export const CheckoutWeb3 = () => {
  const navigate = useNavigate();
  const [selectedWallet, setSelectedWallet] = useState<any>();

  const [loadingText, setLoadingText] = useState<any>("Loading...");
  const [statusButton, setStatusButton] = useState<any>(true);
  const {
    id,
    requestAccessJson,
    generalAdmissionSelect,
    setRequestAccessJson,
    setRequestAccessError,
    setGrantAccessJson,
    setGrantAccessError,
  } = useContext(CheckoutPortalContext);
  const [loading, setLoading] = useState(false);
  const connectHook = useConnect();
  const disconnectHook = useDisconnect();
  const accountHook = useAccount();
  const signHook = useSignMessage({
    message: requestAccessJson?.signing_message,
  });

  const ConnectWallet = () => {
    // todo: ENS resolution
    const ensName = null;
    if (accountHook && accountHook.data && accountHook.data.address) {
      return (
        <div className="connected-wallet-container d-flex fs-12">
          <div className="col-span-2 fw-bold">
            {ensName
              ? `${ensName} (${accountHook.data.address})`
              : accountHook.data.address}
          </div>
          <div className="col-span-1">
            {" "}
            Connected to {connectHook?.activeConnector?.name}
          </div>
          <button
            className="col-span-1 dc-btn fs-10"
            onClick={() => disconnectHook.disconnect()}
          >
            Disconnect
          </button>
        </div>
      );
    }
    return (
      <div className="row">
        {connectHook.connectors.map((x) => {
          return (
            <div className="col-sm-4 pe-sm-10" key={x.id}>
              <div className="wallet-button">
                <input
                  disabled={!x.ready}
                  onClick={() => {
                    connectHook.connect(x);
                    setSelectedWallet(x);
                  }}
                  type="radio"
                  name="wallet"
                  className="wallet-button-input"
                  id={x.id}
                  checked={x === selectedWallet ? true : false}
                />
                <label htmlFor={x.id} className="wallet-button-label">
                  <div className="ws-75 mw-100 mx-auto">
                    <Web3ConnectorImage connector={x.name} />
                  </div>
                  <div className="fs-base-n2 text-strong fw-700 text-truncate text-center mt-10">
                    {x.name}
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // request access handler (based on web3 account data change)
  useEffect(() => {
    (async function () {
      setRequestAccessJson(null);
      setRequestAccessError(null);
      let response: any;
      // api call
      response = await TicketedEventRequestAccess.call({
        public_id: id,
        checkout_type: "blockchain_ownership",
      });
      if (response && response.httpStatus) {
        if (response.httpStatus === 200) {
          setRequestAccessJson(response);
        } else {
          setRequestAccessError(response);
        }
      }
    })();
  }, []);

  // checkout handler
  // handles signing message and posting related data to API
  useEffect(() => {
    (async function () {
      if (signHook.data && accountHook && accountHook.data) {
        setLoading(true);
        setLoadingText("Verifying ownership");
        let response;
        response = await TicketedEventGrantAccess.call({
          public_id: id,
          checkout_type: "blockchain_ownership",
          wallet_address: accountHook.data.address,
          signed_message: signHook.data,
          blockchain_ownership_id: requestAccessJson.id,
          tickets_requested: generalAdmissionSelect,
        });
        if (response) {
          setLoading(false);
        }
        if (response.httpStatus === 200) {
          setGrantAccessJson(response);
          navigate(`/${id}/checkout/status`);
        } else {
          setGrantAccessError(response);
          navigate(`/${id}/checkout/status`);
        }
      }
    })();
  }, [signHook.data]);

  // useeffect hook to flip checkout button status
  // based on wallet address from accountHook
  useEffect(() => {
    if (accountHook && accountHook.data && accountHook.data.address) {
      setStatusButton(false);
    } else {
      setStatusButton(true);
    }
  }, [accountHook]);

  async function handleCheckout() {
    setLoadingText(`Awaiting wallet signature`);
    await signHook.signMessageAsync();
  }

  if (signHook.isLoading || loading) {
    return <Loading loadingText={loadingText} />;
  }

  return (
    <div className="row">
      {/* <!-- Checkout information start --> */}
      <div className="col-md-7">
        <div className="content">
          <h1 className="text-strong fw-700 fsr-4 mt-0 mb-0">
            Complete Checkout
          </h1>
          <p className="mt-10">
            Select from one of the checkout options below.
          </p>
          <h6 className="text-strong fw-700 fsr-6 mt-30">Checkout Options</h6>
          <div
            className="alert rounded-3 border-secondary d-flex align-items-center"
            role="alert"
          >
            <div className="text-secondary fs-base-p4">
              <i className="fa-regular fa-check-circle"></i>
            </div>
            <div className="ms-20">
              <h6 className="alert-heading text-strong fw-700 mb-0">
                Proof of NFT Ownership
              </h6>
              <p className="my-0">Select from the crypto wallet options.</p>
            </div>
          </div>
          <p className="d-flex align-items-start fs-base-n2">
            <i className="fa-regular fa-info-circle me-10 mt-5"></i>
            <span>
              Proof of NFT ownership is <strong>not</strong> an NFT trade. We
              only need you to prove that you own the NFT to create the ticket.
            </span>
          </p>

          {/* <!-- Wallet radio buttons start --> */}
          <ConnectWallet />
          {/* <!-- Wallet radio buttons end --> */}
        </div>
      </div>
      {/* <!-- Checkout information end --> */}

      {/* <!-- CTA section start --> */}
      <div className="col-md-5">
        <div className="p-content position-md-sticky top-0 start-0">
          <div className="d-flex align-items-center">
            <h6 className="text-strong fw-700 fsr-6 mt-0 mb-0">Summary</h6>

            {/* <!-- Edit button start --> */}
            <div className="text-secondary ms-auto">
              <a onClick={() => navigate(-1)} className="link-reset fw-bold">
                Edit
              </a>
            </div>
            {/* <!-- Edit button end --> */}
          </div>
          <p className="mt-10">
            {generalAdmissionSelect} &times; General Admission Ticket
            <br />
            <strong>Price &mdash; </strong> Free
          </p>
          <button
            onClick={() => handleCheckout()}
            className="btn btn-secondary btn-lg fsr-6 btn-block"
            disabled={statusButton}
          >
            <strong className="antialiased">Continue</strong>
          </button>
        </div>
      </div>
      {/* <!-- CTA section end --> */}
    </div>
  );
};
