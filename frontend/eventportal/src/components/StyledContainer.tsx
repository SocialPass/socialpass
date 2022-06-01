import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
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
  return (
    <div className="container-fluid p-0 d-flex flex-column justify-content-center card">
      {location.pathname.includes("checkout") ? (
        <header
          className="small-header"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          {backButton && (
            <div className="back" onClick={() => backButton()}>
              <img src={_backButton} alt="Back Button" height="24" width="24" />
              <h4 className="ps-5 m-0">Go back</h4>
            </div>
          )}
          <div className="small-team-info">
            <h4>{retrieveJson && retrieveJson?.title}</h4>
            <h5>{retrieveJson && retrieveJson?.team.name}</h5>
          </div>
        </header>
      ) : (
        <header
          className="header d-flex align-items-center justify-content-center"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          <div className="team-info mx-3 mx-md-5 ps-2 column">
            <img
              src={retrieveJson && retrieveJson.team && retrieveJson.team.image}
              alt="Team Image"
            />
            <h4>
              name team
              {retrieveJson && retrieveJson.team && retrieveJson?.team.name}
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
