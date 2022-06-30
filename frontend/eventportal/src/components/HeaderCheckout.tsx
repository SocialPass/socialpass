import { useNavigate } from "react-router-dom";
import _backButton from "../static/images/back.svg";
import socialpassLogo from "../static/images/icons/socialpassLogo.svg";

export default function HeaderCheckout() {
  const navigate = useNavigate();

  return (
    <header className="small-header d-flex align-items-start justify-content-center flex-row">
      {/*IMAGE*/}
      <div className="sp-header-logo-img d-flex align-items-center justify-content-center">
        <img src={socialpassLogo} alt="SocialPass Logo" />
      </div>
      {/*IMAGE*/}
      <div className="back-button" onClick={() => navigate(-1)}>
        <img
          src={_backButton}
          alt="Back Button"
          height="32"
          width="32"
          key={_backButton}
        />
        <h4 className="ps-5 m-0">Go back</h4>
      </div>
    </header>
  );
}
