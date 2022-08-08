import { useContext } from "react";
import { CheckoutPortalContext } from "../../context";
import socialPassIcon from "../../static/brand-logos/SocialPass-Icon-gray.svg";

import qrcodeImage from "../../static/images/qrcode.png";

export default function TicketEvent() {
  const { retrieveJson, generalAdmissionSelect } = useContext(
    CheckoutPortalContext
  );

  const date = new Date().toLocaleDateString("en-us", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  const hour = new Date().toLocaleString("en-us", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className={`bg-secondary ticket-event p-10 h-auto`}>
      <div className="d-flex flex-wrap align-items-start justify-content-between">
        <div className="d-flex align-items-center justify-content-start">
          <div className="ws-100 d-inline-flex align-items-center fs-13">
            <img
              src={socialPassIcon}
              id="SocialPassHeaderIcon"
              alt={
                retrieveJson?.team.theme?.brand_name
                  ? `${retrieveJson?.team.theme?.brand_name} Icon`
                  : "SocialPass Icon"
              }
              className="w-25"
            />
            <span className="mx-5 text-white">SocialPass</span>
          </div>
        </div>
        <div className="d-flex text-white fs-13 d-flex flex-column align-items-end">
          <span className="fs-10">{hour}</span>
          <span>{date}</span>
        </div>
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
      <div className="mt-30 d-flex align-items-center justify-content-center">
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
