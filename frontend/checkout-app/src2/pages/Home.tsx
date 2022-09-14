import React from 'react'

export default function Home() {
	return (
		<div>
		{/* Navbar start */}
		<nav className="d-flex align-items-center px-20">
			{/* Branding start */}
			<a href="#" className="d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none">
				<div className="ws-75">
					<img src="images/SocialPass-Icon.svg" alt="SocialPass Icon" className="d-block w-100 h-auto" />
				</div>
				<div className="text-strong ms-10">
					<div className="fs-base-p4">
						SocialPass
					</div>
					<div className="fs-base-n4 lh-1 fw-normal">
						Ticket Portal
					</div>
				</div>
			</a>
			{/* Branding end */}

			{/* Dark mode toggle start */}
			<button type="button" className="btn btn-sm btn-square btn-rounded ms-20" data-hm-toggle="dark-mode">
				<i className="fa-solid fa-moon"></i>
				<span className="visually-hidden">Toggle dark mode</span>
			</button>
			{/* Dark mode toggle end */}
		</nav>
		{/* Navbar end */}

		{/* Header start */}
		<div className="w-100 hs-200 position-relative">
			{/* Event cover image start */}
			<div className="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm rounded-top overflow-hidden pe-none">
				  <img src="https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-100 h-auto" alt="Cover image" />
			  </div>
			  {/* Event cover image end */}

			  {/* Team image start */}
			  <div className="position-absolute z-1 top-100 start-0 translate-y-middle px-content">
				  <div className="ws-100 hs-100 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden">
					  <img src="https://www.gitbook.com/cdn-cgi/image/width=100,height=100,fit=contain,dpr=1,format=auto/https%3A%2F%2F2919503366-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FoAjCVAKyaqd3D8vQvqdq%252Ficon%252FSxoMd2us80sdMcUcQ36e%252FSocialPass%2520Logo.jpeg%3Falt%3Dmedia%26token%3D0e6830d3-362b-4383-b36b-ea0ddb6195be" className="d-block w-100 h-auto" alt="Team image" />
				  </div>
			  </div>
			  {/* Team image end */}
		</div>
		{/* Header end */}

		{/* Team name start */}
		<div className="px-content pt-50">
			<p className="text-muted mt-5 mb-0">
				Hosted By
			</p>
			<h2 className="text-strong fs-base fw-700 m-0">
				SocialPass
			</h2>
		</div>
		{/* Team name end */}

		{/* Event content start */}
		<div className="row">
			{/* Event information start */}
			<div className="col-md-7">
				<div className="content">
					<h1 className="text-strong fw-700 fsr-1 mt-0 mb-0">
						NFT Holders Party
					</h1>
					<p className="mt-20">
						Come celebrate with the SocialPass Team! All NFT holders are invited, must be 21+ to enter.
					</p>
					<div className="text-muted d-flex align-items-center mt-20">
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
					<div className="alert alert-success mt-30 text-success-dim-lm px-20 py-10 fw-bold rounded-3" role="alert">
						<strong className="fw-700">4,000</strong> out of 50,000 available
					</div>
				</div>
			</div>
			{/* Event information end */}

			{/* CTA section start */}
			<div className="col-md-5">
				<div className="p-content position-md-sticky top-0 start-0">
					<div className="d-flex align-items-center">
						<h6 className="text-strong fw-700 fsr-6 mt-0 mb-0">
							General Admission
						</h6>

						{/* Information dropdown start */}
						<div className="dropup toggle-on-hover ms-auto">
							<a href="#" className="text-secondary text-decoration-none" data-hm-toggle="dropdown" id="general-admission-toggle" aria-expanded="false">
								<i className="fa-regular fa-info-circle"></i>
								<span className="visually-hidden">Information</span>
							</a>
							<div className="dropdown-menu dropdown-menu-end p-10 ws-250 rounded-2" aria-labelledby="general-admission-toggle">
								<div>
									This General Admission ticket is free to all holders of 1 NFT of collection:
								</div>
								<div className="mt-10">
									<strong>MAYC</strong>
								</div>
								<div className="text-truncate">
									Contract:
									<span className="text-secondary">
										<a href="#" className="fw-bold link-reset">
											0X60...A7C6
										</a>
									</span>
								</div>
							</div>
						</div>
						{/* Information dropdown end */}
					</div>
					<p className="text-muted mt-20">
						Sale ends on May 31, 2022
					</p>
					<div className="form-group">
						<select className="form-select">
							<option value="1">1</option>
							<option value="2" selected="selected">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
						</select>
					</div>
					<button className="btn btn-secondary btn-lg fsr-6 btn-block">
						<strong className="antialiased">Get Tickets &times; 2</strong>
					</button>
					<p>
						2 &times; General Admission Ticket
						<br />
						<strong>Price &mdash; </strong> Free
					</p>
				</div>
			</div>
			{/* CTA section end */}
		</div>
		{/* Event content end */}
	</div>
	)
}
