import React from 'react';
import { useState } from 'react';
import TicketCounter from '../ticketCounter';

function TicketPaymentSelector(): JSX.Element {

    
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
			"price": "10000",     //number
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
			"price": "2",     //number
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
			"price": "3",     //number
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
            
            <div className="row">
							{/*<!-- Ticket tiers start -->*/}
							<div className="col-md-7">
								<div className="content me-md-0">
									{/*<!-- Ticket tier start -->*/}
									<div className="ticket-tier mb-20">
										<input type="checkbox" className="ticket-tier-input" id="c1" checked></input>
										<label htmlFor="c1" className="ticket-tier-label">
											<div className="d-sm-flex align-items-center">
												<div className="pe-sm-15">
													<h6 className="fw-700 m-0 fs-base">
														<span className="ticket-tier-uncheck">
															<i className="fa-light fa-square"></i>
														</span>
														<span className="ticket-tier-check">
															<i className="fa-light fa-check-square"></i>
														</span>
														{mockedTiers.tier1.ticket_type}
													</h6>
													<p className="m-0 fs-base-n2">
													{mockedTiers.tier1.capacity} available
													</p>
												</div>
												<TicketCounter />
											</div>
										</label>
									</div>
									{/*<!-- Ticket tier end -->*/}
									{/*<!-- Ticket tier start -->*/}
									<div className="ticket-tier mb-20">
										<input type="checkbox" className="ticket-tier-input" id="c2"></input>
										<label htmlFor="c2" className="ticket-tier-label">
											<div className="d-sm-flex align-items-center">
												<div className="pe-sm-15">
													<h6 className="fw-700 m-0 fs-base">
														<span className="ticket-tier-uncheck">
															<i className="fa-light fa-square"></i>
														</span>
														<span className="ticket-tier-check">
															<i className="fa-light fa-check-square"></i>
														</span>
														{mockedTiers.tier2.ticket_type}
													</h6>
													<p className="m-0 fs-base-n2">
													{mockedTiers.tier2.capacity} available
													</p>
												</div>
                                                <TicketCounter />

											</div>
										</label>
									</div>
									{/*<!-- Ticket tier end -->*/}

									{/*<!-- Ticket tier start -->*/}
									<div className="ticket-tier mb-20">
										<input type="checkbox" className="ticket-tier-input" id="c3"></input>
										<label htmlFor="c3" className="ticket-tier-label">
											<div className="d-sm-flex align-items-center">
												<div className="pe-sm-15">
													<h6 className="fw-700 m-0 fs-base">
														<span className="ticket-tier-uncheck">
															<i className="fa-light fa-square"></i>
														</span>
														<span className="ticket-tier-check">
															<i className="fa-light fa-check-square"></i>
														</span>
														{mockedTiers.tier2.ticket_type}
													</h6>
													<p className="m-0 fs-base-n2">
														{mockedTiers.tier3.capacity} available
													</p>
												</div>
                                                <TicketCounter />

											</div>
										</label>
									</div>
									{/*<!-- Ticket tier end -->*/}
								</div>
								{/*<!-- Ticket tiers end -->*/}
							</div>
							{/*<!-- Ticket tiers start -->*/}

							{/*<!-- CTA section start -->*/}
							<div className="col-md-5">
								<div className="px-content pt-md-30 position-md-sticky top-0 start-0">
									<p className="fs-base-n2 mt-0">
										Your ticket(s) will be sent to your email address, so please make sure you enter the correct one! <a href="#" className="fw-bold" target="_blank">Learn more <i className="fa-regular fa-external-link"></i></a>
									</p>
									<form>
										<input type="text" name="email" className="form-control" placeholder="Email Address"></input>
										<button className="btn btn-secondary btn-lg fsr-6 btn-block mt-15" type="submit">
											<strong className="antialiased">Get Tickets</strong>
										</button>
									</form>
									<p>
										<strong>Total Price</strong>
										&mdash;
										$9.99
									</p>
									<hr />
									<p className="text-muted fs-base-n4">
										You're also agreeing to our <a href="#" className="fw-bold" target="_blank">Terms & Conditions <i className="fa-regular fa-external-link"></i></a> by clicking on the above button.
									</p>
								</div>
							</div>
							{/*<!-- CTA section end -->*/}
						</div>

        </>
    );
}

export default TicketPaymentSelector;