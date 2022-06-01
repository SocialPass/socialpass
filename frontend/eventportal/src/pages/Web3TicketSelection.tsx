import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventPortalContext } from "../context";

export function Web3TicketSelection() {
  const navigate = useNavigate();
  const { setBackButton } = useContext(EventPortalContext);
  const back_button = () => {
    navigate(-1);
  };
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
  return (
    <div className="d-flex flex-row flex-grow-1 justify-content-between">
      <div>
        <div>
          <h3 className="fs-20">Ticket Selection</h3>
          <p>Select ticket...</p>
        </div>
        <div className="d-flex flex-row align-items-start justify-content-between">
          <div>
            <div className="d-flex flex-row align-items-center me-15">
              <span className="fs-20 fw-bold me-15">General Admission</span>
              <span
                data-toggle="tooltip"
                data-placement="top"
                title="This General Admission ticket is free to all holders of 1 NFT collection: "
              >
                icon
              </span>
            </div>
            <br />
            <span>Free</span>
            <p>Sale ends on May 31, 2022</p>
          </div>
          <div>
            <select className="btn">
              select item
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>
        <hr />
      </div>
      <div className="bg-gray d-flex flex-column justify-start-center">
        <div className="d-flex flex-column align-items-start justify-start-center p-30">
          <h3 className="fs-20">Summary</h3>
          <div className="d-flex flex-row">
            <p>2 X General Admission Ticket</p>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center p-30 mt-50">
          <button
            onClick={() => {
              setBackButton(() => back_button);
              navigate("/checkout/web3/connect");
            }}
            className="btn btn-primary fs-20"
          >
            continue
          </button>
        </div>
      </div>
    </div>
  );
}
