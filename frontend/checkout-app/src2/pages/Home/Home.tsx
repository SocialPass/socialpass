import React from 'react'

import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckoutPortalContext } from '../../../src/context'
import TicketPaymentSelector from '../../components/TicketPaymentSelector'
import TicketTierSelector from '../../components/TicketTierSelector'
import './index.css'



export default function Home() {
	const navigate = useNavigate()
	const { id, retrieveJson, generalAdmissionSelect, setGeneralAdmissionSelect } =
		useContext(CheckoutPortalContext)

	const generalAdmissionSelectArray = Array.from(
		{ length: generalAdmissionSelect },
		(_, i) => i + 1,
	)

	function handleNavigate() {
		navigate(`/${id}/checkout/blockchain`)
	}

	function handleSelect(event: any) {
		setGeneralAdmissionSelect(event.target.value)
	}


	const [addTicket, removeTicket] = useState(true)
	var  ticketAmount = 0;

	/*	START OF THE EVENT SCHEMA	*/
	/*		EVENT - If I had the API connection it would receive an object following the below schema	*/
	const mockedEvent = ({
		"team": {
			"name": "SocialPass",				//string
			"image": "https://www.gitbook.com/cdn-cgi/image/width=100,height=100,fit=contain,dpr=1,format=auto/https%3A%2F%2F2919503366-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FoAjCVAKyaqd3D8vQvqdq%252Ficon%252FSxoMd2us80sdMcUcQ36e%252FSocialPass%2520Logo.jpeg%3Falt%3Dmedia%26token%3D0e6830d3-362b-4383-b36b-ea0ddb6195be",				//string URL
			"theme": {
				"logo": "../../../backend/static/images/SocialPass-Icon.svg",			//string path
				"favicon": "../../../backend/static/images/SocialPass-Icon.svg",		//string path
				"css_theme": "",	//string
			}
		},
		"title": "NFT Holders Party",							//string
		"description": "Come celebrate with the SocialPass Team! All NFT holders are invited. You just need to make sure you're 21+ to enter.",				//string
		"requirements": "requirements",			//string
		"limit_per_person": 5,					//number
		"start_date": "%A, %B %d, %Y | %H:%M%p",	//string formatted: %A, %B %d, %Y | %H:%M%p
		"timezone": "EST",						//string
		"localized_address_display": "James L. Knight Center, Miami, Florida, USA",	//string
		"capacity": 100,							//number
		"ticket_count": 10,						//number
		"cover_image": "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",				//string URL
		"show_ticket_count": true,				//boolean
		"show_team_image": true,		//boolean
	})
	/*	END OF THE EVENT SCHEMA	*/



	return (
		<div>
			{/*<!-- Page wrapper start -->*/}
			<div className="page-wrapper">
				{/*<!-- Content wrapper start -->*/}
				<div className="content-wrapper ws-820 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column">
					{/*<!-- Main content start -->*/}
					<div>
						{/*<!-- Header start -->*/}
						<div className="w-100 hs-200 position-relative">
							{/*<!-- Event cover image start -->*/}
							<div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none">
								<img src="https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-100 h-auto" alt="Cover image"></img>
							</div>
							{/*<!-- Event cover image end -->*/}

							{/*<!-- Team image start -->*/}
							<div className="position-absolute z-1 top-100 start-50 translate-middle px-content">
								<div className="ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden">
									<img src="https://www.gitbook.com/cdn-cgi/image/width=100,height=100,fit=contain,dpr=1,format=auto/https%3A%2F%2F2919503366-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FoAjCVAKyaqd3D8vQvqdq%252Ficon%252FSxoMd2us80sdMcUcQ36e%252FSocialPass%2520Logo.jpeg%3Falt%3Dmedia%26token%3D0e6830d3-362b-4383-b36b-ea0ddb6195be" className="d-block w-100 h-auto" alt="Team image"></img>
								</div>
							</div>
							{/*<!-- Team image end -->*/}
						</div>
						{/*<!-- Header end -->*/}

						{/*<!-- Team name start -->*/}
						<div className="px-content pt-40 text-center">
							<p className="text-muted mt-5 mb-0">
								Hosted By
							</p>
							<h6 className="text-strong fs-base fw-700 m-0">
								{mockedEvent.team.name}
							</h6>
						</div>
						{/*<!-- Team name end -->*/}

						{/*<!-- Event content start -->*/}
						<div className="row">
							{/*<!-- Hero section start -->*/}
							<div className="col-md-7">
								<div className="content mt-20 mb-0">
									<h1 className="text-strong fw-700 display-6 m-0">
										{mockedEvent.title}
									</h1>
									<p className="mt-20 fsr-6">
										{mockedEvent.description}
									</p>
								</div>
							</div>
							{/*<!-- Hero section end -->*/}

							{/*<!-- Event details start -->*/}
							<div className="col-md-5">
								<div className="content mt-0 mt-md-30 mb-0">
									{/*<!-- Event date & time start -->*/}
									<div className="d-flex align-items-center">
										<div className="ws-25 flex-shrink-0">
											<i className="fa-regular fa-clock"></i>
										</div>
										<div className="fw-bold">
											Date & Time
										</div>
									</div>
									<p className="text-muted mt-5 mb-0">
										{mockedEvent.start_date}
									</p>
									{/*<!-- Event date & time end -->*/}

									{/*<!-- Event location start -->*/}
									<div className="d-flex align-items-center mt-15">
										<div className="ws-25 flex-shrink-0">
											<i className="fa-regular fa-location-dot"></i>
										</div>
										<div className="fw-bold">
											Location
										</div>
									</div>
									<p className="text-muted mt-5 mb-0">
										{mockedEvent.localized_address_display}
									</p>
									{/*<!-- Event location end -->*/}
								</div>
							</div>
							{/*<!-- Event details end -->*/}

							{/*<!-- Ticket status start -->*/}
							<div className="col-12">
								<div className="content mt-20 mb-0">
									{/*<!-- { if tickets are available } -->*/}
									<div className="alert alert-primary m-0 text-primary-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center" role="alert">
										<i className="fa-regular fa-check me-15"></i>
										<p className="m-0">
											Tickets available! Please select the payment type and tickets you want to purchase.
										</p>
									</div>
									{/*<!-- { else show the following } -->*/}
									{/*<!--
									<div className="alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center" role="alert">
										<i className="fa-regular fa-times me-15"></i>
										<p className="m-0">
											Sorry! Tickets are not available for this event.
										</p>
									</div>
									-->
									*/}
								</div>
							</div>
							{/*<!-- Ticket status end -->*/}
						</div>
						{/*<!-- Event content end -->*/}

						{/*<!-- Ticket tier payment types start -->*/}
						

						<TicketTierSelector />

						{/*<!-- Ticket tier payment types end -->*/}

						{/*<!-- Ticket tiers and CTA start -->*/}
						


						<TicketPaymentSelector />


						{/*<!-- Ticket tiers and CTA end -->*/}
					</div>
					{/*<!-- Main content end -->*/}
				</div>
				{/*<!-- Footer start -->*/}
				<div className="content text-end border-top pt-10">
				</div>
				{/*<!-- Footer end -->*/}
				{/*<!-- Content wrapper end -->*/}
			</div>
			{/*<!-- Page wrapper end -->*/}
		</div>
	)
}
