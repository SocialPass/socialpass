import React, { useContext } from "react";
import _backButton from "../static/images/back.svg";
import Footer from "./Footer";
import EventNavbar from "./EventNavbar";
import { CheckoutPortalContext } from "../context";
// import Header from "./Header";

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { retrieveJson } = useContext(CheckoutPortalContext);
  return (
    // <!-- Page wrapper start -->
    <div className="page-wrapper">
      {/* <!-- Content wrapper start --> */}
      <div className="content-wrapper ws-860 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column">
        {/* <!-- Main content start --> */}
        <div>
          {/* <!-- Navbar start --> */}
          <EventNavbar />
          {/* <!-- Navbar end --> */}
          {/* <!-- Header start --> */}
          <div className="w-100 hs-200 position-relative">
            {/* <!-- Event cover image start --> */}
            <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none">
              <img
                src="https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="w-100 h-auto"
                alt="Cover image"
              />
            </div>
            {/* <!-- Event cover image end --> */}

            {/* <!-- Team image start --> */}
            <div className="position-absolute z-1 top-100 start-0 translate-y-middle px-content">
              <div className="ws-100 hs-100 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden">
                <img
                  src={retrieveJson?.team.image}
                  className="d-block w-100 h-auto"
                  alt="Team image"
                />
              </div>
            </div>
            {/* <!-- Team image end --> */}
          </div>
          {/* <!-- Header end --> */}
          {/* <!-- Team name start --> */}
          <div className="px-content pt-50">
            <p className="text-muted mt-5 mb-0">Hosted By</p>
            <h2 className="text-strong fs-base fw-700 m-0">
              {retrieveJson?.team.name}
            </h2>
          </div>
          {/* <!-- Team name end --> */}
          {/* <!-- Event content start --> */}
          {children}
          {/* <!-- Event content end --> */}
        </div>
        {/* <!-- Main content end --> */}

        {/* <!-- Footer start --> */}
        <Footer />
        {/* <!-- Footer end --> */}
      </div>
      {/* <!-- Content wrapper end --> */}
    </div>
  );
};
