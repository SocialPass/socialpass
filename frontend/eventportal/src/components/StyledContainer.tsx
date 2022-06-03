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
  const { backButton, retrieveJson } = useContext(EventPortalContext);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="left-30 container-fluid p-0 d-flex flex-column justify-content-center card">
      {location.pathname.length > 45 ? (
        <header
          className="small-header"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
            <div className="back" onClick={() => navigate(-1)}>
              <img src={_backButton} alt="Back Button" height="24" width="24" />
              <h4 className="ps-5 m-0">Go back</h4>
            </div>
          <div className="small-team-info">
            <h4>{retrieveJson && retrieveJson?.event_info.title}</h4>
            <h5>{retrieveJson && retrieveJson?.organizer_info.name}</h5>
          </div>
        </header>
      ) : (
        <header
          className="header d-flex align-items-center justify-content-center"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          <div className="team-info mx-3 mx-md-5 ps-2 column">
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
      <footer>
        <img src={FAQImage} alt="image" />
        <small className="d-flex flex-row align-items-center">
          Powered by &nbsp;
          <img src={logoImage} alt="image" />
        </small>
      </footer>
    </div>
  );
};
