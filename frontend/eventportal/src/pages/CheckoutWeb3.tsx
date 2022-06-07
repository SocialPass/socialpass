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
  const {
    id,
    requestAccessJson,
    generalAdmissionSelect,
    setRequestAccessJson,
    setRequestAccessError,
    setGrantAccessJson,
    setGrantAccessError,
  } = useContext(EventPortalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }] = useAccount();
  const [{ data: signData, loading: signLoading }, signMessage] =
    useSignMessage({
      message: requestAccessJson?.signing_message,
    });

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
      if (signData) {
        setLoading(true);
        let response;
        response = await TicketedEventGrantAccess.call({
          public_id: id,
          checkout_type: "blockchain_ownership",
          wallet_address: accountData?.address,
          signed_message: signData,
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
  }, [signData]);

  function handleNavigateBack() {
    navigate(-1);
  }

  function handleCheckout() {
    console.log("checkout...");
    signMessage();
  }

  if (signLoading || loading) {
    return <Loading loadingText="Verifying NFTs" />;
  }

  if (connectData) {
    return (
      <div className="responsive-page-selection">
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
          <div className="col-lg-12 d-flex mt-30 d-flex gap-10 column-display-mobile">
            {connectData.connectors.map((x) => (
              <button
                className="btn btn-secondary fs-15 border-0 shadow-none d-flex flex-column align-items-center justify-content-around w-100 mt-3"
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

  return null;
};
