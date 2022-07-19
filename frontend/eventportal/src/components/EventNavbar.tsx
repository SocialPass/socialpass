import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import socialPassIcon from "../static/images/SocialPass-Icon.svg";

export default function EventNavbar() {
  const { retrieveJson } = useContext(CheckoutPortalContext);
  return (
    <nav className="d-flex align-items-center px-20">
      {/* <!-- Branding start --> */}
      <a
        href="#"
        className="d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none"
      >
        <div className="ws-75">
          <img
            src={socialPassIcon}
            id="SocialPassHeaderIcon"
            alt={
              retrieveJson?.team.theme.brand_name
                ? `${retrieveJson?.team.theme.brand_name} Icon`
                : "SocialPass Icon"
            }
            className="d-block w-100 h-auto"
          />
        </div>
        <div className="text-strong ms-10">
          <div className="fs-base-p4">
            {retrieveJson?.team.theme.brand_name
              ? retrieveJson?.team.theme.brand_name
              : "SocialPass"}
          </div>
          <div className="fs-base-n4 lh-1 fw-normal">Ticket Portal</div>
        </div>
      </a>
      {/* <!-- Branding end --> */}

      {/* <!-- Dark mode toggle start --> */}
      <button
        type="button"
        className="btn btn-sm btn-square btn-rounded ms-20"
        data-hm-toggle="dark-mode"
      >
        <i className="fa-solid fa-moon"></i>
        <span className="visually-hidden">Toggle dark mode</span>
      </button>
      {/* <!-- Dark mode toggle end --> */}
    </nav>
  );
}
