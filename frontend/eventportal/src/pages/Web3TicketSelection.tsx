import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventPortalContext } from "../context";
import infoButton from "../static/images/icons/infoButton.svg";

export function Web3TicketSelection() {
  const navigate = useNavigate();
  const { setBackButton, generalAdmissionSelect, setGeneralAdmissionSelect } =
    useContext(EventPortalContext);
  const back_button = () => {
    navigate(-1);
  };

  function handleSelect(event) {
    setGeneralAdmissionSelect(event.target.value);
  }
  return (
    <div className="responsive-page-selection">
      <div>
        <div>
          <h3 className="fs-20">Ticket Selection</h3>
          <p>Select ticket...</p>
        </div>
        <div className="d-flex flex-row align-items-start justify-content-between">
          <div>
            <div className="d-flex flex-row align-items-center me-12">
              <span className="fs-18 fw-bold me-15">General Admission</span>

              <div className="tooltip">
                <img src={infoButton} />
                <div className="right">
                  <span className="tooltip-text fs-11">
                    This General Admission ticket is free to all holders of 1
                    NFT collection:
                    <h3>MAYC</h3>
                    <span className="fs-12">
                      Contract: <span>0X60..A7C6</span>
                    </span>
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="d-inline fw-bold">free</div>
            <br />
            <p>Sale ends on May 31, 2022</p>
          </div>
          <div>
            <select
              defaultValue={generalAdmissionSelect}
              onChange={handleSelect}
              className="btn btn-primary px-20 ms-40"
            >
              select item
              <option className="bg-white text-color-primary" value={1}>
                1
              </option>
              <option className="bg-white text-color-primary" value={2}>
                2
              </option>
              <option className="bg-white text-color-primary" value={3}>
                3
              </option>
              <option className="bg-white text-color-primary" value={4}>
                4
              </option>
            </select>
          </div>
        </div>
        <hr className="border-top" />
      </div>
      <div className="bg-gray d-flex flex-column justify-start-center">
        <div className="d-flex flex-column align-items-start justify-start-center p-30">
          <h3 className="fs-20">Summary</h3>
          <div className="d-flex flex-row">
            <p>{generalAdmissionSelect} X General Admission Ticket</p>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center p-30 mt-50">
          <button
            onClick={() => {
              setBackButton(() => back_button);
              navigate("/checkout/web3/connect");
            }}
            className="btn btn-primary fs-20 text-capitalize rounded-3"
          >
            continue
          </button>
        </div>
      </div>
    </div>
  );
}
