import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventPortalContext } from "../context";
import infoButton from "../static/images/icons/infoButton.svg";

export function TicketSelection() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.publicId;
  const { generalAdmissionSelect, setGeneralAdmissionSelect } = useContext(EventPortalContext);
  // [1 ... generalAdmissionSelectArray]
  const generalAdmissionSelectArray = Array.from({length: generalAdmissionSelect}, (_, i) => i + 1)

  function handleSelect(event:any) {
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
              {generalAdmissionSelectArray.map(function(object){
                  return (
                    <option className="bg-white text-color-primary" value={1}>
                      {object}
                    </option>
                  )
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
