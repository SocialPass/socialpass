import React from "react";
import _backButton from "../static/images/back.svg";
import Footer from "./Footer";
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
      <Footer/>
    </div>
  );
};
