import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckoutPortalContext } from "../context";
// import headerImage from "../static/images/header1.svg";
// import FAQImage from "../static/images/FAQ.svg";
import logoImage from "../static/images/socialpass.svg";
import _backButton from "../static/images/back.svg";
import socialpassLogo from "../static/images/icons/socialpassLogo.svg";

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { retrieveJson } = useContext(CheckoutPortalContext);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="container-fluid card container-hack p-0">
      {/* HEADER */}

      <div>
        {/* Small header vs header display logic is based on URL length, not ideal. (Lucas?) */}
        {location.pathname.length > 45 ? (
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
        ) : (
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
        )}

        {/* MAIN CONTENTS */}
        <div className="p-30">{children}</div>

        {/* FOOTER */}
        <footer className="sp-footer me-15 ms-15">
          {/* <img src={FAQImage} alt="image" /> */}
          <small className="d-flex flex-row align-items-center">
            Powered by &nbsp;
            <img src={logoImage} alt="image" />
          </small>
        </footer>
      </div>
    </div>
  );
};
