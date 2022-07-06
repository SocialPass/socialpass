import { useEffect, useContext, useState } from "react";
import { useConnect, useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import { TicketedEventRequestAccess, TicketedEventGrantAccess } from "../api";
import { Loading } from "../components/";
import { Web3ConnectorImage } from "../components/Web3ConnectorImage";
import { CheckoutPortalContext } from "../context";
import NFTOwnershipFAQHoverIcon from "../components/NFTOwnershipFAQ";

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

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

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
      <div className="wallets-selection wallets">
        {connectHook.connectors.map((x) => (
          <button
            className={
              selectedWallet === x
                ? "fs-12 fw-bold card-active shadow-none d-flex flex-column align-items-center justify-content-around w-100 mt-3"
                : "fs-12 btn-secondary border-0 card-disabled shadow-none d-flex flex-column align-items-center justify-content-around w-100 mt-3"
            }
            disabled={!x.ready}
            key={x.id}
            id={x.id}
            onClick={() => {
              connectHook.connect(x);
              setSelectedWallet(x);
            }}
          >
            <Web3ConnectorImage selectedWallet={x} connector={x.name} />
            {x.name}
            {!x.ready && " (unsupported)"}
          </button>
        ))}
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

  function handleNavigateBack() {
    navigate(-1);
  }

  async function handleCheckout() {
    setLoadingText(`Awaiting wallet signature`);
    await signHook.signMessageAsync();
  }

  if (signHook.isLoading || loading) {
    return <Loading loadingText={loadingText} />;
  }

  return (
    <div className="responsive-page-selection">
      <div className="d-flex flex-column">
        <div>
          <h3 className="fs-20">Complete Checkout</h3>
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
          <div className="border-color-primary px-30 py-10 rounded-3 d-flex align-items-start justify-content-start flex-column">
            <div className="fw-bold fs-15">Proof of NFT Ownership</div>
            <span>Select from the crypto wallet options</span>
          </div>

          <div className="tooltip">
            <NFTOwnershipFAQHoverIcon locationClass="bottom-left"></NFTOwnershipFAQHoverIcon>
          </div>
        </div>
        <ConnectWallet />
        {connectHook.error && (
          <div>{connectHook.error?.message ?? "Failed to connect"}</div>
        )}
        {signHook.error && (
          <div>{signHook.error?.message ?? "Failed to connect"}</div>
        )}
      </div>
      <div className="bg-gray d-flex flex-column justify-start-center p-30">
        {/* If on desktop mode, append bg-gray-extend to document */}
        {matches === true ? <div className="bg-gray-extend"></div> : null}
        <div className="d-flex flex-column align-items-start justify-start-center">
          <div className="d-flex align-items-center justify-content-center">
            <h3 className="fs-20">Summary &nbsp;</h3>
            <a onClick={handleNavigateBack} className="text-edit fs-12 fw-bold">
              Edit
            </a>
          </div>
          <div className="d-flex flex-row">
            <p>{generalAdmissionSelect} X General Admission Ticket</p>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-50">
          <button
            disabled={statusButton}
            onClick={() => handleCheckout()}
            className="btn btn-primary rounded-3"
          >
            <span className="p-5 fs-18 text-capitalize">Checkout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
