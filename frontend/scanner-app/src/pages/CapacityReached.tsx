/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useNavigate } from "react-router-dom";
import ColoredLogo from "../static/images/socialpass-colored-logo.svg";


export function CapacityReached() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-background p-10 py-50">
    <div className="d-flex flex-column align-items-center justify-content-around">
      <img className="p-30" src={ColoredLogo} />
      <div className="d-flex flex-column align-items-center justify-content-center gap-4 p-10">
        <div className="capacity-reached-title pt-20">
          Awesome!
        </div>
        <div className="capacity-reached-body p-20">
          Every generated ticket has been scanned!
        </div>
     </div>
     </div>

     </div>
  );
}
