import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
import timezone from "../static/images/icons/timezone.svg";
import denied from "../static/images/icons/denied.svg";

export default function CheckoutFailedPage() {
  const { id, grantAccessError, retrieveJson } = useContext(
    CheckoutPortalContext
  );
  const navigate = useNavigate();
  //console.log(grantAccessJson, grantAccessError);
  
  return (
    <div className="row flex-grow-1 m-0 mt-3 align-items-center">
      <div className="col-md-7 mb-4 d-flex">
        <div className="col col-md-10">
          <h1>Access Denied</h1>
          <p className="fs-16">
            We are unable to issue any tickets for this event
          </p>
          <code>Error Code: {grantAccessError?.message}</code>
          <div className="fw-bold bg-denied p-5 strong my-15 text-center d-flex align-items-center justify-content-evenly">
            <img src={denied} height="16.9" width="16.9" />
            <span className="fs-14">ACCESS DENIED</span>
          </div>
          <div className="mt-30 d-flex flex-row justify-content-start align-items-center gap-30">
          <img
              src={"https://picsum.photos/200"}
              key={"https://picsum.photos/200"}
              className="avatar-img"
            // src={retrieveJson.team.image}
            />
            <div className="d-flex flex-column gap-5 mb-15">
              <strong className="fs-22">{retrieveJson.title}</strong>
              <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
                <img
                  src={clock}
                  height="16.9"
                  width="16.9"
                  className="me-5"
                  alt="Date & Time"
                />
                {retrieveJson.start_date}
              </p>
              <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
                <img
                  src={timezone}
                  height="16.9"
                  width="16.9"
                  className="me-5"
                  alt="Timezone"
                />
                {retrieveJson.timezone}
              </p>
              <p className="d-flex align-items-center m-0 mt-1 mb-1 fs-16">
                <img
                  src={location}
                  height="16.9"
                  width="16.9"
                  className="me-5"
                  alt="Location"
                />
                {retrieveJson?.location}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-5 mt-30">
        <button
          className="btn-primary fs-22"
          onClick={() => {
            navigate(`/${id}`);
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}