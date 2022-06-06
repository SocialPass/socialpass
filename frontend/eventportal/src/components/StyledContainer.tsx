import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventPortalContext } from "../context";
import headerImage from "../static/images/header1.svg";
import FAQImage from "../static/images/FAQ.svg";
import logoImage from "../static/images/socialpass.svg";
import _backButton from "../static/images/back.svg";

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
      {location.pathname.length > 45 ? (
        <header
          className="small-header"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          <div className="back" onClick={() => navigate(-1)}>
            <img src={_backButton} alt="Back Button" height="24" width="24" />
            <h4 className="ps-5 m-0">Go back</h4>
          </div>
        </header>
      ) : (
        <header
          className="header d-flex align-items-start justify-content-center"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          <div className="team-info">
            <img
              src={
                retrieveJson &&
                retrieveJson.organizer_info &&
                retrieveJson.organizer_info.profile_image
              }
              alt="Team Image"
            />
            <h4>
              {retrieveJson &&
                retrieveJson.organizer_info &&
                retrieveJson?.organizer_info.name}
            </h4>
          </div>
        </header>
      )}
      <div className="d-flex mx-3 mx-md-5 mt-5 flex-grow-1 h-100 p-30">
        {children}
      </div>
      <footer className="d-flex flex-row justify-content-between align-items-center">
        <img src={FAQImage} alt="image" />
        <small className="d-flex flex-row align-items-center">
          Powered by &nbsp;
          <img src={logoImage} alt="image" />
        </small>
      </footer>
    </div>
  );
};
