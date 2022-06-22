import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
// Event Component
export const Event = (): JSX.Element => {
  const navigate = useNavigate();
  const { id, retrieveJson } = useContext(CheckoutPortalContext);
  // default, return baseGate
  // todo: customize basegate more, perhaps current content as children

  function handleNavigate() {
    navigate(`/${id}/ticket-selection`);
  }

  return (
    <div className="row flex-grow-1 m-0 mt-3 align-items-center mt-10">
      <div className="col-md-7 mb-4 d-flex">
        <div className="col col-md-10 mb-30">
          <div className="mt-15 mb-15 d-flex flex-column align-items-start justify-content-center">
            <span className="fs-30 fw-bold">{retrieveJson?.title}</span>
            <span className="fs-16 fw-light text-muted">
              {retrieveJson?.description}
            </span>
          </div>
          <div className="d-flex flex-column gap-5 mb-15">
            <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
              <img
                src={clock}
                height="16.9"
                width="16.9"
                className="me-5"
                alt="Date & Time"
              />
              {retrieveJson?.date} | {retrieveJson?.timezone}
            </p>
            <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
              <img
                src={location}
                height="16.9"
                width="16.9"
                className="me-5"
                alt="Date & Time"
              />
              {retrieveJson?.location}
            </p>
          </div>
          <span className="col-md-7 bg-success py-5 px-30 text-center">
            <strong>{retrieveJson?.ticket_count}</strong> out of{" "}
            {retrieveJson?.capacity} available
          </span>
        </div>
      </div>
      <div className="col-md-4 offset-md-1">
        <button className="btn-primary fw-700 fs-20" onClick={handleNavigate}>
          Claim Tickets
        </button>
      </div>
    </div>
  );
};
