import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventPortalContext } from "../context";
import headerImage from "../static/images/header1.svg";
import FAQImage from "../static/images/FAQ.svg";
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
  const { retrieveJson } = useContext(EventPortalContext);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="left-30 container-fluid p-0 card">
      <div>
        {location.pathname.length > 45 ? (
          <header
            className="small-header"
            // style={{ backgroundImage: `url(${headerImage})` }}
          >
            <div className="d-flex align-items-center justify-content-center mt-15">
              <img src={socialpassLogo} alt="Logo" />
            </div>
            <div className="back" onClick={() => navigate(-1)}>
              <img src={_backButton} alt="Back Button" height="24" width="24" />
              <h4 className="ps-5 m-0">Go back</h4>
            </div>
          </header>
        ) : (
          <header
            className="header d-flex align-items-start justify-content-center"
            // style={{ backgroundImage: `url(${headerImage})` }}
          >
            <div className="d-flex align-items-center justify-content-center mt-50">
              <img src={socialpassLogo} alt="Logo" />
            </div>
            <div className="team-info">
              <img
                src={
                  retrieveJson &&
                  retrieveJson.organizer_info &&
                  retrieveJson.organizer_info.profile_image
                }
                alt="Team Image"
              />
              <h4 className="fs-15 d-block">
                {retrieveJson &&
                  retrieveJson.organizer_info &&
                  retrieveJson?.organizer_info.name}
              </h4>
            </div>
          </header>
        )}
        <div className="mt-5 p-30">{children}</div>
        <footer className="me-15 ms-15">
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
