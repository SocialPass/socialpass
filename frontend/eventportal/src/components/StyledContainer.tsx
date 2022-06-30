import React from "react";
import logoImage from "../static/images/socialpass.svg";
import _backButton from "../static/images/back.svg";
import Header from "./Header";

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  return (
    <div className="container-fluid card container-centered p-0">
      <Header/>

      {/* MAIN CONTENTS */}
      <div className="main-contents">{children}</div>

      {/* FOOTER */}
      <footer className="sp-footer me-15 ms-15">
        <small className="d-flex flex-row align-items-center">
          Powered by &nbsp;
          <img src={logoImage} alt="image" />
        </small>
      </footer>
    </div>
  );
};
