import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
import correct from "../static/images/icons/correct.svg";
import denied from "../static/images/icons/denied.svg";

export const CheckoutStatus = () => {
  const { id, grantAccessJson, grantAccessError, retrieveJson } =
    useContext(EventPortalContext);
  const navigate = useNavigate();
  console.log(grantAccessJson, grantAccessError);
  if (grantAccessJson) {
    return (
      <div className="row flex-grow-1 m-0 mt-3 align-items-center">
        <div className="col-md-7 mb-4 d-flex">
          <div className="col col-md-10">
            <h1>Congrats</h1>
            <p>You made it! Click the button to download your ticket</p>
            <div className="fw-bold bg-success p-5 strong my-15 text-center d-flex align-items-center justify-content-evenly">
              <img src={correct} height="16.9" width="16.9" className="me-4" />
              access granted
              <span></span>
            </div>
            <div className="d-flex flex-row justify-content-start align-items-center gap-30">
              <img
                className="avatar-img"
                src={retrieveJson.organizer_info.profile_image}
              />
              <div>
                <strong>{retrieveJson.event_info.title}</strong>
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
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <button className="btn-primary">Download Tickets</button>
        </div>
      </div>
    );
  }
  return (
    <div className="row flex-grow-1 m-0 mt-3 align-items-center">
      <div className="col-md-7 mb-4 d-flex">
        <div className="col col-md-10">
          <h1>Something Went Wrong</h1>
          <p>We’re sorry, we were not able to redeem this Token Gate</p>
          <div className="fw-bold bg-denied p-5 strong my-15 text-center d-flex align-items-center justify-content-evenly">
            <img src={denied} height="16.9" width="16.9" />
            access denied
            <span></span>
          </div>
          <div className="d-flex flex-row justify-content-start align-items-center gap-30">
            <img
              className="avatar-img"
              src={retrieveJson.organizer_info.profile_image}
            />
            <div>
              <strong>{retrieveJson.event_info.title}</strong>
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
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <button
          className="btn-primary fw-700 fs-20"
          onClick={() => {
            navigate(`/${id}`);
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
};
