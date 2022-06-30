import { useContext } from "react";
import { CheckoutPortalContext } from "../context";
import _backButton from "../static/images/back.svg";
import socialpassLogo from "../static/images/icons/socialpassLogo.svg";

export default function Header() {
  const { retrieveJson } = useContext(CheckoutPortalContext);

  return (
    <header className="header d-flex align-items-start justify-content-center">
      {/*IMAGE*/}
      <div className="sp-header-logo-img d-flex align-items-center justify-content-center">
        <img src={socialpassLogo} alt="SocialPass Logo" />
      </div>
      {/*IMAGE*/}
      <div className="team-info-img">
        <img
          src={"https://picsum.photos/200"}
          alt="Team Image"
          key={"https://picsum.photos/200"}
          /* USED TO BE {retrieveJson && retrieveJson?.team?.image} */
          /* TODO: GO BACK TO USING THE SET IMAGES WHEN BACKEND GETS FIXED */
        />
      </div>
    </header>
  );
}
