import React from 'react';
import { useState } from 'react';

function TicketCounter(): JSX.Element {
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

     
	/*	START OF THE TICKET TIERS SCHEMA	*/
	/*		TICKET TIERS AND TIERS PAYMENT TYPE - If I had the API connection it would receive an object following the below schema	*/

	const mockedTiers =
	{
		tier1: {
			// root_ticket_tier
			"id": "1",     //number
			"created": "2017-03-31 9:30:20",     //date
			"modified": "2017-03-31 9:30:20",     //date
			"public_id": "3f22a1db-7bf0-4444-a13b-25347c174df7",     //uuid
			"event_id": "1",     //number
			"ticket_type": "General Admission",     //varchar
			"price": 10000,     //number
			"capacity": 10,     //number
			"max_per_person": "2",     //number
			"payment_types": [
				{
					//root_ticket_tier_payment_type
					"id": "id",      //number
					"created": "2017-03-31 9:30:20",      //date
					"modified": "2017-03-31 9:30:20",      //date
					"public_id": "public_id",      //number
					"payment_type": "payment_type",      //number
					"ticket_tier_id": "1",      //number
				}
			]
		},
		tier2: {
			// root_ticket_tier
			"id": "2",     //number
			"created": "2017-03-31 9:30:20",     //date
			"modified": "2017-03-31 9:30:20",     //date
			"public_id": "1",     //number
			"event_id": "3f22a1db-7bf0-4444-a13b-25347c174df7",     //uuid
			"ticket_type": "Deluxe Admission",     //varchar
			"price": 2,     //number
			"capacity": 11,     //number
			"max_per_person": "max_per_person",     //number
			"payment_types": [
				{
					//root_ticket_tier_payment_type
					"id": "id",      //number
					"created": "2017-03-31 9:30:20",      //date
					"modified": "2017-03-31 9:30:20",      //date
					"public_id": "public_id",      //number
					"payment_type": "payment_type",      //number
					"ticket_tier_id": "2",      //number
				}
			]
		},
		tier3: {
			// root_ticket_tier
			"id": "3",     //number
			"created": "2017-03-31 9:30:20",     //date
			"modified": "2017-03-31 9:30:20",     //date
			"public_id": "3f22a1db-7bf0-4444-a13b-25347c174df7",     //uuid
			"event_id": "1",     //number
			"ticket_type": "VIP Admission",     //varchar
			"price": 3,     //number
			"capacity": 13,     //number
			"max_per_person": "max_per_person",     //number
			"payment_types": [
				{
					//root_ticket_tier_payment_type
					"id": "id",      //number
					"created": "2017-03-31 9:30:20",      //date
					"modified": "2017-03-31 9:30:20",      //date
					"public_id": "public_id",      //number
					"payment_type": "payment_type",      //number
					"ticket_tier_id": "3",      //number
				}
			]
		}
	}


	/*	END OF THE TICKET TIERS SCHEMA	*/



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
          &mdash; ${(mockedTiers.tier1.price)*(counterValueFromCurrentRender)}
        </div>
      </div>
    </>
  );
}

export default TicketCounter;