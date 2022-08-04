import { useContext } from "react";
import { CheckoutPortalContext } from "../context";

export default function CardInfoEvent() {
  const { retrieveJson, generalAdmissionSelect } = useContext(
    CheckoutPortalContext
  );
  const date = retrieveJson.start_date.split("|");
  console.log(date);

  return (
    <div className="card-info-event px-30 py-15 h-auto">
      <div>
        <span className="d-block fw-bold fs-26">{retrieveJson.title}</span>
        <span className="text-muted">Order #54878641</span>
      </div>
      {/* ICONS */}
      <div className="mt-15 d-flex flex-column align-items-start gap-15">
        {/* icon */}
        <div className="d-flex flex-row align-items-center justify-content-start gap-15">
          <i
            className="fa fa-mobile text-secondary fs-20"
            aria-hidden="true"
          ></i>
          <div>
            <strong className="fs-18">{generalAdmissionSelect} x Ticket</strong>
            <span className="d-block text-muted fs-15">General Admission</span>
          </div>
        </div>
        {/*end icon */}
        <div className="d-flex flex-row align-items-center justify-content-start gap-15">
          <i
            className="fa fa-map-marker text-secondary fs-20"
            aria-hidden="true"
          ></i>
          <div>
            <strong className="fs-18">{retrieveJson.location}</strong>
            <span className="d-block text-muted fs-15">
              {retrieveJson.location}
            </span>
          </div>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-start gap-15">
          <i className="fa-solid fa-alarm-clock text-secondary fs-20"></i>
          <div>
            <strong className="fs-18">{date[0]}</strong>
            <span className="d-block text-muted fs-15">
              {date[1]} {retrieveJson.timezone}
            </span>
          </div>
        </div>
      </div>
      {/* END ICONS */}
      <div className="mt-20 ">
        <a href="#" className="text-secondary text-underline fw-bold">
          See details <i className="fa-solid fa-angle-down"></i>
        </a>
      </div>
    </div>
  );
}
