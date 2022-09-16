import React from 'react'
import SocialPassIcon from '../static/socialpass-theme/SocialPass-Icon.svg'
import SomethingWentWrong from '../static/images/something_went_wrong.svg'

export default function Error() {
	return (
		<div>
			{/* Navbar start */}
			<nav className="d-flex align-items-center px-20">
				{/* Branding start */}
				<a href="#" className="d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none">
					<div className="ws-75">
						<img src={SocialPassIcon} alt="SocialPass Icon" className="d-block w-100 h-auto"/>
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

			<div className="content">
				<div className="ws-500 mw-100 mx-auto text-center">
					<div className="ws-300 mw-100 mx-auto">
						<img src={SomethingWentWrong} className="d-block w-100 h-auto" alt="something_went_wrong"/>
					</div>
					<h1 className="text-strong fw-700 fsr-1 mb-0">
						Something went wrong!
					</h1>
					<p>
						Looks like something went wrong. Please try reloading the page, or try again after some time.
					</p>
				</div>
			</div>
		</div>
	)
}
