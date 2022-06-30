import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import logoImage from "../static/images/socialpass.svg";
import _backButton from "../static/images/back.svg";
import Header from "./Header";
import HeaderCheckout from "./HeaderCheckout";
import { CheckoutPortalContext } from "../context";

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { headerType } = useContext(CheckoutPortalContext);
  const location = useLocation();
  console.log(location);

  return (
    <div className="container-fluid card container-centered p-0">
      {/* HEADER */}

      {headerType == "light" ? <Header /> : <HeaderCheckout />}

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
