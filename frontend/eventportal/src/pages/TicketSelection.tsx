import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventPortalContext } from "../context";
import { truncateAddress } from "../utils";
import infoButton from "../static/images/icons/infoButton.svg";

export function TicketSelection() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.publicId;
  const { retrieveJson, generalAdmissionSelect, setGeneralAdmissionSelect } =
    useContext(EventPortalContext);
  // [1 ... generalAdmissionSelectArray]
  const generalAdmissionSelectArray = Array.from(
    { length: generalAdmissionSelect },
    (_, i) => i + 1
  );

  function handleSelect(event: any) {
    setGeneralAdmissionSelect(event.target.value);
  }
  return (
    <div className="responsive-page-selection">
      <div>
        <div className="d-flex flex-column align-items-start justify-content-between mb-30 gap-5">
          <span className="fs-20 fw-700">Ticket Selection</span>
          <span className="text-muted">
            Select your tickets from the options below
          </span>
        </div>
        <div className="responsive-ticket-selection">
          <div>
            <div className="d-flex flex-row align-items-center me-12">
              <span className="fs-18 fw-bold me-15">General Admission</span>

              <div className="tooltip">
                <img src={infoButton} />
                <div className="right">
                  <span className="tooltip-text fs-11">
                    This General Admission ticket is free to all holders of 1
                    NFT collection:
                    <hr />
                    {retrieveJson?.requirements.map((req, i) => (
                      <div key={i}>
                        <h3>Option {i + 1}</h3>
                        <span className="fs-12">
                          Contract:{" "}
                          <span>{truncateAddress(req["asset_address"])}</span>
                        </span>
                        <hr />
                      </div>
                    ))}
                  </span>
                </div>
              </div>
            </div>
            <div className="d-inline fw-bold">free</div>
            <br />
            <p>Sale ends on May 31, 2022</p>
          </div>
          <div className="d-inline">
            <select
              defaultValue={generalAdmissionSelect}
              onChange={handleSelect}
              className="ticket-select btn-primary px-10 ms-30"
            >
              {generalAdmissionSelectArray.map(function (object) {
                return (
                  <option
                    key={object}
                    className="bg-white text-color-primary"
                    value={1}
                  >
                    {object}
                  </option>
                );
              })}
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
              navigate(`/${id}/checkout/blockchain`);
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
