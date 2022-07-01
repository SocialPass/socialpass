import { useContext } from "react";
import { CheckoutPortalContext } from "../context";

export default function ReadMoreModal() {

  const { retrieveJson } = useContext(CheckoutPortalContext);

  return (
    <div
      className="modal fade read-more-modal"
      id="event-modal"
      aria-labelledby="event-modal-toggle"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body text-justify">
            <span className="fs-16">{retrieveJson.description}</span>
          </div>
        </div>
      </div>
    </div>
  )
}