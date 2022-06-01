import React from "react";
import { EventPortalContext } from "../context";

// Loading Component
// todo
export const Loading = ({ loadingText }) => {
  return (
    <div className="row d-flex align-items-center justify-content-center flex-grow-1">
      <div className="col-12 text-center">
        <div className="d-flex flex-column justify-content-center">
          <strong className="fs-3">{loadingText}</strong>
          <p className="fs-5">Please wait, this might take a second</p>
        </div>
        <div className="container">
          <div className="sp-progress">
            <div
              className="sp-progress-bar sp-progress-bar-animated"
              style={{ width: "100vw" }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
