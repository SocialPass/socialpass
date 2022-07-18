import { useContext } from "react";
import { CheckoutPortalContext } from "../context";

export default function CheckoutSuccessPage() {
  const { retrieveJson, grantAccessJson } = useContext(CheckoutPortalContext);
  //console.log(grantAccessJson, grantAccessError);

  return (
    // <div className="row flex-grow-1 m-0 mt-3 align-items-center">
    //   <div className="col-md-8 mb-4 d-flex">
    //     <div className="col col-md-10">
    //       <h1>Congrats!</h1>
    //       <p className="fs-16">
    //         You made it! Click the button to download your tickets:
    //       </p>
    //       <div className="fw-bold bg-success p-5 strong my-15 text-center d-flex align-items-center justify-content-evenly">
    //         <img src={correct} height="16.9" width="16.9" className="me-4" />
    //         <span className="fs-14">ACCESS GRANTED</span>
    //       </div>
    //       <div className="d-flex flex-row justify-content-start align-items-center gap-30">
    //         <img
    //           src={retrieveJson.team.image}
    //           key={retrieveJson.team.image}
    //           className="avatar-img"
    //           // src={retrieveJson.team.image}
    //         />
    //         <div className="d-flex flex-column gap-5 mb-15">
    //           <strong className="fs-22">{retrieveJson.title}</strong>
    //           <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-12">
    //             <img
    //               src={clock}
    //               height="16.9"
    //               width="16.9"
    //               className="me-5"
    //               alt="Date & Time"
    //             />
    //             {retrieveJson.start_date}
    //           </p>
    //           <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-12">
    //             <img
    //               src={timezone}
    //               height="16.9"
    //               width="16.9"
    //               className="me-5"
    //               alt="Timezone"
    //             />
    //             {retrieveJson.timezone}
    //           </p>
    //           <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-12">
    //             <img
    //               src={location}
    //               height="16.9"
    //               width="16.9"
    //               className="me-5"
    //               alt="Location"
    //             />
    //             {retrieveJson?.location}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="col-md-4 mt-30">
    //     <button
    //       onClick={() =>
    //         window.open(grantAccessJson[0]["temporary_download_url"])
    //       }
    //       className="btn-primary fs-22 mt-5"
    //     >
    //       View Tickets
    //     </button>
    //   </div>
    // </div>
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
            Click on the following button to download your ticket.
          </p>
          <button
            onClick={() =>
              window.open(grantAccessJson[0]["temporary_download_url"])
            }
            className="btn btn-secondary btn-lg fsr-6 btn-block"
          >
            <strong className="antialiased">Download Ticket</strong>
          </button>
        </div>
      </div>
      {/* <!-- CTA section end --> */}
    </div>
  );
}
