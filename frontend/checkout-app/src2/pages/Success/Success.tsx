import React from 'react'

export default function Success() {
	return (
		<div>
			{/* Header start */}
			<div className="w-100 hs-150 position-relative">
				{/* Event cover image start */}
				<div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none">
					<img src="https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-100 h-auto" alt="Cover image" />
				</div>
				{/* Event cover image end */}

				{/* Back button start */}
				<div className="position-absolute z-1 bottom-0 start-0 px-content py-20">
					<a href="#" className="btn btn-rounded ps-5 d-flex align-items-center">
						<div className="ws-25 hs-25 bg-secondary text-on-secondary rounded-circle d-flex align-items-center justify-content-center">
							<i className="fa-regular fa-arrow-left"></i>
						</div>
						<strong className="text-strong antialiased ms-10">Go Back</strong>
					</a>
				</div>
				{/* Back button end */}
			</div>
			{/* Header end */}

			{/* Status content start */}
			<div className="row">
				{/* Status information start */}
				<div className="col-md-7">
					<div className="content">
						<h1 className="text-strong fw-700 fsr-4 mt-0 mb-0">
							Congrats!
						</h1>
						<p className="mt-10">
							You made it! We've verified your NFT ownership and generated your ticket.
						</p>
						<div className="alert alert-success d-inline-block text-success-dim-lm px-10 py-5 fw-bold rounded-3" role="alert">
							<i className="fa-regular fa-check me-5"></i> Access Granted
						</div>
						<div className="d-flex align-items-center">
							<div className="ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0">
								  <img src="https://www.gitbook.com/cdn-cgi/image/width=100,height=100,fit=contain,dpr=1,format=auto/https%3A%2F%2F2919503366-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FoAjCVAKyaqd3D8vQvqdq%252Ficon%252FSxoMd2us80sdMcUcQ36e%252FSocialPass%2520Logo.jpeg%3Falt%3Dmedia%26token%3D0e6830d3-362b-4383-b36b-ea0ddb6195be" className="d-block w-100 h-auto" alt="Team image" />
							  </div>
							<div className="px-content ps-20">
								<p className="text-muted m-0 text-truncate">
									By SocialPass
								</p>
								<h2 className="text-strong fs-base-p2 fw-700 m-0 text-truncate">
									NFT Holders Party
								</h2>
							</div>
						</div>
						<div className="text-muted d-flex align-items-center mt-10">
							<div className="ws-25 flex-shrink-0">
								<i className="fa-regular fa-clock"></i>
							</div>
							<div className="text-truncate">
								Friday, April 15 | 8:00 - 10:30 PM EST
							</div>
						</div>
						<div className="text-muted d-flex align-items-center mt-5">
							<div className="ws-25 flex-shrink-0">
								<i className="fa-regular fa-location-dot"></i>
							</div>
							<div className="text-truncate">
								James L. Knight Center | Miami, FL
							</div>
						</div>
					</div>
				</div>
				{/* Status information end */}

				{/* CTA section start */}
				<div className="col-md-5">
					<div className="p-content position-md-sticky top-0 start-0">
						<h6 className="text-strong fw-700 fsr-6 mt-0 mb-0">
							Get Ticket
						</h6>
						<p className="mt-10">
							Click on the following button to download your ticket.
						</p>
						<button className="btn btn-secondary btn-lg fsr-6 btn-block">
							<strong className="antialiased">Download Ticket</strong>
						</button>
					</div>
				</div>
				{/* CTA section end */}
			</div>
			{/* Status content end */}
		</div>
	)
}
