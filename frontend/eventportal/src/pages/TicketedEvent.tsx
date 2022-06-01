import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Reward, Loading } from "../components";
import { EventPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
// TicketedEvent Component
export const TicketedEvent = (): JSX.Element => {
  const navigate = useNavigate();
  const { retrieveError, retrieveJson, grantAccessJson, setBackButton } =
    useContext(EventPortalContext);
  // default, return baseGate
  // todo: customize basegate more, perhaps current content as children
  const json = {
    title: "NFT Holders Party",
    description:
      "Come celebrate with the SocialPass Team! All NFT holders are invited, must be 21+ to enter",
    location: "James L.Knight Center | Miami, FL",
    date: "Friday, April 15",
    timezone: "8:00 - 10:30 PM EST",
    capacity: 10000,
    ticket_count: 5000,
  };
  if (grantAccessJson) {
    return <Reward grantAccessJson={grantAccessJson} />;
  }
  const back_button = () => {
    navigate(-1);
  };

  // if (retrieveJson){
  return (
    <div className="row flex-grow-1 m-0 mt-3 align-items-center">
      <div className="col-md-7 mb-4 d-flex">
        <div className="col col-md-10">
          <h1>{json.title}</h1>
          <p>{json.description}</p>
          <p className="d-flex align-items-center m-0 mt-1 mb-1">
            <img
              src={clock}
              height="16.9"
              width="16.9"
              className="me-1"
              alt="Date & Time"
            />
            {json.date} | {json.timezone}
          </p>
          <p className="d-flex align-items-center m-0 mt-1 mb-1">
            <img
              src={location}
              height="16.9"
              width="16.9"
              className="me-1"
              alt="Date & Time"
            />
            {json.location}
          </p>
          <div className="bg-success py-5 strong my-15 text-center">
            <strong className="text-center">
              {(json.capacity - json.ticket_count)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </strong>{" "}
            out of{" "}
            {json.capacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            available
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <button
          className="btn-primary"
          onClick={() => {
            setBackButton(() => back_button);
            navigate("/checkout/web3/select");
          }}
        >
          Claim Tickets
        </button>
      </div>
    </div>
  );
};
