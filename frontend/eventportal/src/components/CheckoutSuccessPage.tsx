import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import AppleWalletButton from "./WalletButtons/AppleWalletButton";
import GoogleWalletButton from "./WalletButtons/GoogleWalletButton";

export default function CheckoutSuccessPage() {
  const { retrieveJson, grantAccessJson } = useContext(CheckoutPortalContext);

  return (
    <>
      <div
        className="modal"
        tabIndex={-1}
        id="success-modal"
        aria-labelledby="success-modal-toggle"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content border-transparent hs-800 mw-100 mh-100 p-0">
            <div className="d-flex align-items-center justify-content-center hs-50 text-strong">
              <span className="text-center fw-bold fs-18">
                How would you like to download?
              </span>
              {/* <a
                href="#"
                type="button"
                className="d-block lh-1 link-reset text-decoration-none ms-auto"
                aria-label="Close"
                data-hm-dismiss="modal"
              >
                <i className="fa-light fa-times fs-base-p6"></i>
              </a> */}
            </div>
            <div className="w-100 h-100">
              <div className="d-flex flex-column align-items-center justify-content-between flex-wrap gap-20 py-20 px-20">
                <div>
                  <button className="btn btn-secondary fs-20 btn-block">
                    Download PDF
                  </button>
                </div>
                <AppleWalletButton />
                <GoogleWalletButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* <!-- Status information start --> */}
        <div className="col-md-7">
          <div className="content">
            <h1 className="text-strong fw-700 fsr-4 mt-0 mb-0">Congrats!</h1>
            <p className="mt-10">
              You made it! We've verified your NFT ownership and generated your
              ticket.
            </p>
            <div
              className="alert alert-success d-inline-block text-success-dim-lm px-10 py-5 fw-bold rounded-3"
              role="alert"
            >
              <i className="fa-regular fa-check me-5"></i> Access Granted
            </div>
            <div className="d-flex align-items-center">
              <div className="ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0">
                <img
                  src={retrieveJson.team.image}
                  className="d-block w-100 h-auto"
                  alt="Team image"
                />
              </div>
              <div className="px-content ps-20">
                <p className="text-muted m-0 text-truncate">
                  By {retrieveJson?.team.name}
                </p>
                <h2 className="text-strong fs-base-p2 fw-700 m-0 text-truncate">
                  {retrieveJson?.title}
                </h2>
              </div>
            </div>
            <div className="text-muted d-flex align-items-center mt-10">
              <div className="ws-25 flex-shrink-0">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div className="text-truncate">{retrieveJson.start_date}</div>
            </div>
            <div className="text-muted d-flex align-items-center mt-5">
              <div className="ws-25 flex-shrink-0">
                <i className="fa-regular fa-location-dot"></i>
              </div>
              <div className="text-truncate">{retrieveJson?.location}</div>
            </div>
          </div>
        </div>
        {/* <!-- Status information end --> */}

        {/* <!-- CTA section start --> */}
        <div className="col-md-5">
          <div className="p-content position-md-sticky top-0 start-0">
            <h6 className="text-strong fw-700 fsr-6 mt-0 mb-0">Get Ticket</h6>
            <p className="mt-10">
              Click on the following button to get your ticket.
            </p>
            <button
              data-hm-toggle="modal"
              data-hm-target="success-modal"
              id="success-modal-toggle"
              onClick={() => window.open(grantAccessJson[0]["download_url"])}
              className="btn btn-secondary btn-lg fsr-6 btn-block"
            >
              <strong className="antialiased">Get Your Ticket</strong>
            </button>
          </div>
        </div>
        {/* <!-- CTA section end --> */}
      </div>
    </>
  );
}
