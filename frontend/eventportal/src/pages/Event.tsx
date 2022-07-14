import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
import ReadMoreModal from "../components/ReadMoreModal";
// Event Component

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export const Event = ({}): JSX.Element => {
  const navigate = useNavigate();
  const { id, retrieveJson } = useContext(CheckoutPortalContext);
  console.log(retrieveJson);

  function handleNavigate() {
    navigate(`/${id}/ticket-selection`);
  }

  const dimensions = getWindowDimensions();

  function isWideVersion() {
    return dimensions.width >= 767;
  }

  return (
    // <>
    //   <div className="row m-0 justify-content-center">
    //     <div className="col-md-8 d-flex">
    //       <div className="col col-md-10 mb-30">
    //         <div className="d-flex flex-column align-items-start justify-content-center">
    //           <span className="fs-16 fw-500 mt-20">
    //             {retrieveJson && retrieveJson?.team?.name}
    //           </span>
    //           <span className="fs-28 fw-bold">{retrieveJson.title}</span>
    //           {isWideVersion() ? (
    //             <span className="fs-16 fw-light text-muted text-justify">
    //               {retrieveJson?.description.length > 200
    //                 ? retrieveJson?.description.slice(0, 180).concat("...")
    //                 : retrieveJson?.description}
    //             </span>
    //           ) : (
    //             <span className="fs-16 fw-light text-muted text-justify">
    //               {retrieveJson?.description}
    //             </span>
    //           )}
    //         </div>
    //         {isWideVersion() && retrieveJson.description.length > 200 && (
    //           <div className="my-10 d-flex align-items-center justify-content-start">
    //             <a
    //               type="button"
    //               className="text-muted fs-16 cursor-pointer text-decoration-underline"
    //               data-hm-toggle="modal"
    //               data-hm-target="event-modal"
    //               id="event-modal-toggle"
    //             >
    //               Read more...
    //             </a>
    //           </div>
    //         )}
    //         <div className="d-flex flex-column gap-5 mb-15">
    //           <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
    //             <img
    //               src={clock}
    //               height="16.9"
    //               width="16.9"
    //               className="me-5"
    //               alt="Date & Time"
    //             />
    //             {retrieveJson.start_date}
    //           </p>
    //           <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
    //             <img
    //               src={timezone}
    //               height="16.9"
    //               width="16.9"
    //               className="me-5"
    //               alt="Timezone"
    //             />
    //             {retrieveJson.timezone}
    //           </p>
    //           <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
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
    //         <span className="col-md-7 bg-success py-5 px-30 text-center">
    //           <strong>{retrieveJson.capacity - retrieveJson.ticket_count}</strong> out of{" "}
    //           {retrieveJson.capacity} available
    //         </span>
    //       </div>
    //     </div>
    //     <div className="col-md-3 ms-5 align-self-center">
    //       <button className="btn-primary fs-20" onClick={handleNavigate}>
    //         Claim Tickets
    //       </button>
    //     </div>
    //   </div>

    //   {/* MODAL */}
    //   <ReadMoreModal />
    // </>
    <div className="row">
      <div className="col-md-7">
        <div className="content">
          <h1 className="text-strong fw-700 fsr-1 mt-0 mb-0">
            {retrieveJson.title}
          </h1>
          <p className="mt-20">{retrieveJson.description}</p>
          <div className="text-muted d-flex align-items-center mt-20">
            <div className="ws-25 flex-shrink-0">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="text-truncate">{retrieveJson.start_date}</div>
          </div>
          <div className="text-muted d-flex align-items-center mt-5">
            <div className="ws-25 flex-shrink-0">
              <i className="fa-regular fa-location-dot"></i>
            </div>
            <div className="text-truncate">{retrieveJson.location}</div>
          </div>
          <div
            className="alert alert-success mt-30 text-success-dim-lm px-20 py-10 fw-bold rounded-3"
            role="alert"
          >
            <strong className="fw-700">
              {(retrieveJson.capacity - retrieveJson.ticket_count)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </strong>{" "}
            out of{" "}
            {retrieveJson.capacity
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            available
          </div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="p-content position-md-sticky top-0 start-0">
          <div className="d-flex align-items-center">
            <h6 className="text-strong fw-700 fsr-6 mt-0 mb-0">
              General Admission
            </h6>

            <div className="dropup toggle-on-hover ms-auto">
              <a
                href="#"
                className="text-secondary text-decoration-none"
                data-hm-toggle="dropdown"
                id="general-admission-toggle"
                aria-expanded="false"
              >
                <i className="fa-regular fa-info-circle"></i>
                <span className="visually-hidden">Information</span>
              </a>
              <div
                className="dropdown-menu dropdown-menu-end p-10 ws-250 rounded-2"
                aria-labelledby="general-admission-toggle"
              >
                <div>
                  This General Admission ticket is free to all holders of 1 NFT
                  of collection:
                </div>
                <div className="mt-10">
                  <strong>MAYC</strong>
                </div>
                <div className="text-truncate">
                  Contract:
                  <span className="text-secondary">
                    <a href="#" className="fw-bold link-reset">
                      0X60...A7C6
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted mt-20">Sale ends on May 31, 2022</p>
          <div className="form-group">
            <select defaultValue={2} className="form-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <button
            className="btn btn-secondary btn-lg fsr-6 btn-block"
            onClick={handleNavigate}
          >
            <strong className="antialiased">Get Tickets &times; 2</strong>
          </button>
          <p>
            2 &times; General Admission Ticket
            <br />
            <strong>Price &mdash; </strong> Free
          </p>
        </div>
      </div>
    </div>
  );
};
