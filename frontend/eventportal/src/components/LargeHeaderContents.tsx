import _backButton from "../static/images/back.svg";
import socialpassLogo from "../static/images/icons/socialpassLogo.svg";

export default function LargeHeaderContents() {

  return (
    <div>
      <div className="sp-header-logo-img d-flex align-items-center justify-content-center">
        <img src={socialpassLogo} alt="SocialPass Logo" />
      </div>
      <div className="team-info-img">

      </div>
    </div>
  );
}
