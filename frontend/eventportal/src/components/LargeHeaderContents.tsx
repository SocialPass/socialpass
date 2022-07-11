import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import _backButton from "../static/images/back.svg";
import socialpassLogo from "../static/images/icons/socialpassLogo.svg";

export default function LargeHeaderContents() {
  const { retrieveJson } = useContext(CheckoutPortalContext);
  console.log(retrieveJson);

  return (
    <div>
      <div className="sp-header-logo-img d-flex align-items-center justify-content-center">
        <img src={socialpassLogo} alt="SocialPass Logo" />
      </div>
      <div className="team-info-img">
        <img
          src={retrieveJson && retrieveJson?.team?.image}
          alt="Team Image"
          key={retrieveJson && retrieveJson?.team?.image}
          /* USED TO BE {retrieveJson && retrieveJson?.team?.image} */
          /* TODO: GO BACK TO USING THE SET IMAGES WHEN BACKEND GETS FIXED */
        />
      </div>
    </div>
  );
}
