import { useEffect, useContext, useState } from "react";
import { useConnect, useAccount, useSignMessage } from "wagmi";
import { useNavigate } from "react-router-dom";
import { TicketedEventRequestAccess, TicketedEventGrantAccess } from "../api";
import { Loading } from "../components/";
import { Web3ConnectorImage } from "../components/Web3ConnectorImage";
import { EventPortalContext } from "../context";
import infoButton from "../static/images/icons/infoButton.svg";

// ConnectorWallets
// Return UI for wallet connectors
export const CheckoutWeb3 = () => {
  const navigate = useNavigate();
  const [selectedWallet, setSelectedWallet] = useState<any>();
  const [loadingText, setLoadingText] = useState<any>('Loading...');
  const [statusButton, setStatusButton] = useState<any>(true);
  const {
    id,
    requestAccessJson,
    generalAdmissionSelect,
    setRequestAccessJson,
    setRequestAccessError,
    setGrantAccessJson,
    setGrantAccessError,
  } = useContext(EventPortalContext);
  const [loading, setLoading] = useState(false);
  const connectHook = useConnect();
  const accountHook = useAccount();
  const signHook = useSignMessage({
    message: requestAccessJson?.signing_message,
  })

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
      if (signHook.data) {
        setLoading(true);
        setLoadingText('Verifying ownership')
        let response;
        response = await TicketedEventGrantAccess.call({
          public_id: id,
          checkout_type: "blockchain_ownership",
          wallet_address: accountHook?.data?.address,
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
  }, [signHook]);

  function handleNavigateBack() {
    navigate(-1);
  }

  function handleSelectWallet(x: any) {
    setSelectedWallet(x);
    setStatusButton(false);
  }

  async function handleCheckout() {
    setLoadingText("Awaiting wallet connection");
    try {
      await connectHook.connectAsync(selectedWallet);
    }
    catch(err) {}
    if (accountHook.data?.address){
      setLoadingText(`Awaiting wallet signature`);
      await signHook.signMessageAsync();
    }
  }

  if (signHook.isLoading || accountHook.isLoading || connectHook.isConnecting || loading) {
    return <Loading loadingText={loadingText}/>;
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
            <img src={infoButton} />
            <div className="right">
              <span className="tooltip-text fs-12">
                Proof of ownership is not an NFT trade. We need to prove you
                own the NFT in order to get the ticket.
              </span>
              <i></i>
            </div>
          </div>
        </div>
        <div className="col-lg-12 d-flex mt-10 d-flex gap-10 column-display-mobile">
          {connectHook.connectors.map((x) => (
            <button
              className={
                selectedWallet === x
                  ? "fs-12 fw-bold card-active shadow-none d-flex flex-column align-items-center justify-content-around w-100 mt-3"
                  : "btn-secondary fs-12 border-0 card-disabled shadow-none d-flex flex-column align-items-center justify-content-around w-100 mt-3"
              }
              disabled={!x.ready}
              key={x.id}
              id={x.id}
              onClick={() => handleSelectWallet(x)}
            >
              <Web3ConnectorImage
                selectedWallet={selectedWallet}
                connector={x.name}
              />
              {x.name}
              {!x.ready && " (unsupported)"}
            </button>
          ))}
        </div>
        {connectHook.error && (
          <div>{connectHook.error?.message ?? "Failed to connect"}</div>
        )}
        {signHook.error && (
          <div>{signHook.error?.message ?? "Failed to connect"}</div>
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
            disabled={statusButton}
            onClick={() => handleCheckout()}
            className="btn btn-primary fs-20 text-capitalize rounded-3"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
