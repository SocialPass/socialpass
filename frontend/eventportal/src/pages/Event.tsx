import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
// Event Component
export const Event = (): JSX.Element => {
  const navigate = useNavigate();
  const { id, retrieveJson } = useContext(EventPortalContext);
  // default, return baseGate
  // todo: customize basegate more, perhaps current content as children

  function handleNavigate() {
    navigate(`/${id}/ticket-selection`);
  }

  // if (retrieveJson){}
  return (
    <div className="row flex-grow-1 m-0 mt-3 align-items-center">
      <div className="col-md-7 mb-4 d-flex">
        <div className="col col-md-10">
          <div className="mt-15 mb-15 d-flex flex-column align-items-start justify-content-center">
            <span className="fs-30 fw-bold">
              {retrieveJson.event_info.title}
            </span>
            <span className="fs-15 fw-light text-muted">
              {retrieveJson.event_info.description}
            </span>
          </div>
          <div className="d-flex flex-column gap-5 mb-15">
            <p className="d-flex align-items-center m-0 mt-1 mb-1">
              <img
                src={clock}
                height="16.9"
                width="16.9"
                className="me-5"
                alt="Date & Time"
              />
              {retrieveJson.event_info.date} |{" "}
              {retrieveJson.event_info.timezone}
            </p>
            <p className="d-flex align-items-center m-0 mt-1 mb-1">
              <img
                src={location}
                height="16.9"
                width="16.9"
                className="me-5"
                alt="Date & Time"
              />
              {retrieveJson.event_info.location}
            </p>
          </div>
          <span className="col-md-7 bg-success py-5 px-30 text-center">
            <strong>
              {retrieveJson.ticket_info.total_capacity -
                retrieveJson.ticket_info.total_tickets_issued}
            </strong>{" "}
            out of {retrieveJson.ticket_info.total_capacity} available
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
