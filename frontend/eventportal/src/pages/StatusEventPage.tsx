import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components";
import { EventPortalContext } from "../context";
import clock from "../static/images/icons/clock.svg";
import location from "../static/images/icons/location.svg";
import correct from "../static/images/icons/correct.svg";
import denied from "../static/images/icons/denied.svg";

export const StatusEventPage = () => {
  const { eventStatusCheckout, retrieveJson } = useContext(EventPortalContext);
  const navigate = useNavigate();

  if (eventStatusCheckout) {
    return (
      <div className="row flex-grow-1 m-0 mt-3 align-items-center">
        <div className="col-md-7 mb-4 d-flex">
          <div className="col col-md-10">
            <h1>Congrats</h1>
            <p>You made it! Click the button to download your ticket</p>
            <div className="bg-success p-5 strong my-15 text-center d-flex align-items-center justify-content-evenly">
              <img src={correct} height="16.9" width="16.9" className="me-4" />
              access granted
              <span></span>
            </div>
            <div className="d-flex flex-row justify-content-around">
              <img
                className="avatar-img"
                src="https://resultadosdigitais.com.br/files/2015/08/thestocks-imagem.jpg"
              />
              <div>
                <strong>{retrieveJson.title}</strong>
                <p className="d-flex align-items-center m-0 mt-1 mb-1">
                  <img
                    src={clock}
                    height="16.9"
                    width="16.9"
                    className="me-1"
                    alt="Date & Time"
                  />
                  {retrieveJson.date} | {retrieveJson.timezone}
                </p>
                <p className="d-flex align-items-center m-0 mt-1 mb-1">
                  <img
                    src={location}
                    height="16.9"
                    width="16.9"
                    className="me-1"
                    alt="Date & Time"
                  />
                  {retrieveJson.location}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <button className="btn-primary">Download Tickets</button>
        </div>
      </div>
    );
  }
  return (
    <div className="row flex-grow-1 m-0 mt-3 align-items-center">
      <div className="col-md-7 mb-4 d-flex">
        <div className="col col-md-10">
          <h1>Something Went Wrong</h1>
          <p>We’re sorry, we were not able to redeem this Token Gate</p>
          <div className="bg-denied p-5 strong my-15 text-center d-flex align-items-center justify-content-evenly">
            <img src={denied} height="16.9" width="16.9" />
            access denied
            <span></span>
          </div>
          <div className="d-flex flex-row justify-content-around">
            <img
              className="avatar-img"
              src="https://resultadosdigitais.com.br/files/2015/08/thestocks-imagem.jpg"
            />
            <div>
              <strong>{retrieveJson.title}</strong>
              <p className="d-flex align-items-center m-0 mt-1 mb-1">
                <img
                  src={clock}
                  height="16.9"
                  width="16.9"
                  className="me-1"
                  alt="Date & Time"
                />
                {retrieveJson.date} | {retrieveJson.timezone}
              </p>
              <p className="d-flex align-items-center m-0 mt-1 mb-1">
                <img
                  src={location}
                  height="16.9"
                  width="16.9"
                  className="me-1"
                  alt="Date & Time"
                />
                {retrieveJson.location}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <button
          className="btn-primary"
          onClick={() => {
            navigate("/ticketed-event");
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
};
