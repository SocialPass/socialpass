import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import socialPassIcon from "../static/brand-logos/SocialPass-Icon.svg";
import qrcodeImage from "../static/images/qrcode.png";

export default function TicketEvent() {
  const { retrieveJson, generalAdmissionSelect } = useContext(
    CheckoutPortalContext
  );
  console.log(retrieveJson);

  const date = retrieveJson.start_date.split(",");

  return (
    <div className="bg-secondary ticket-event p-15 h-auto">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center justify-content-start">
          <div className="ws-100 d-inline-flex align-items-center">
            <img
              src={socialPassIcon}
              id="SocialPassHeaderIcon"
              alt={
                retrieveJson?.team.theme?.brand_name
                  ? `${retrieveJson?.team.theme?.brand_name} Icon`
                  : "SocialPass Icon"
              }
              className="w-50 h-auto ws-75"
            />
            <span className="ms-5 text-white">SocialPass</span>
          </div>
        </div>
      </div>
      <div className="text-white fs-15">
        {date[0]},{date[1]}
      </div>
      <div className="text-white d-flex flex-column gap-20 mt-30">
        <div>
          <span className="d-block fs-14 fw-500">EVENT</span>
          <span className="fw-100">{retrieveJson.title}</span>
        </div>
        <div>
          <span className="d-block fs-14 fw-500">WHERE</span>
          <span className="fw-100">{retrieveJson.location}</span>
        </div>
        <div>
          <span className="d-block fs-14 fw-500">TICKET</span>
          <span className="fw-100">
            General admission: {generalAdmissionSelect} ticket
          </span>
        </div>
      </div>
      <div className="my-30 d-flex align-items-center justify-content-center">
        <div className="ws-100 hs-100 bg-white rounded-4">
          <img
            className="w-100 h-auto rounded-4"
            src={qrcodeImage}
            alt="qrcode image"
          />
        </div>
      </div>
    </div>
  );
}
