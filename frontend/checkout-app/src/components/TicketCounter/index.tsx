import React from 'react';
import { useState } from 'react';

function TicketCounter(props): JSX.Element {
  const [counterValueFromCurrentRender, queueRerenderWithNewCounterValue] =
    useState(0);

  const handleAddOne = () => {
    queueRerenderWithNewCounterValue(counterValueFromCurrentRender + 1);
  };

  const handleSubtractOne = () => {
    if (counterValueFromCurrentRender > 0) {
      queueRerenderWithNewCounterValue(counterValueFromCurrentRender - 1);
    }
  }






  return (
    <>
      <div className="ticket-tier-controls ms-auto mt-10 mt-sm-0">
        <div className="input-group input-group-sm input-group-pill ws-100 mx-auto">
          <button className="btn ws-25 px-0"
          onClick={handleSubtractOne}
          >-
          </button>
          <div className="form-control form-number text-center">{counterValueFromCurrentRender}</div>
          <button className="btn ws-25 px-0"
          onClick={handleAddOne}
          >+</button>
        </div>
        <div className="text-center fs-base-n2 mt-5">
          <strong>Price &times; {counterValueFromCurrentRender}</strong>
          &mdash; ${(props.price)*(counterValueFromCurrentRender)}
        </div>
      </div>
    </>
  );
}

export default TicketCounter;