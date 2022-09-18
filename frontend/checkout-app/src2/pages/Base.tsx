import React from 'react'
import { Outlet } from 'react-router-dom'
import SocialPassIcon from '../static/socialpass-theme/SocialPass-Icon.svg'

export default function Base() {
	return (
		<div className="page-wrapper">
			{/* Content wrapper start */}
			<div className="content-wrapper ws-860 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column">
				{/* Navbar start */}
				<nav className="d-flex align-items-center px-20">
					{/* Branding start */}
					<a href="#" className="d-flex align-items-center link-reset text-decoration-none fw-bold user-select-none">
						<div className="ws-75">
							<img src={SocialPassIcon} alt="SocialPass Icon" className="d-block w-100 h-auto" />
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

				{/* Render Child Route Start */}
				<Outlet/>
				{/* Render Child Route End */}

				{/* Footer start */}
				<div className="content d-flex align-items-center mt-auto">
					<a href="https://socialpass.gitbook.io/socialpass/" target="_blank" className="text-secondary text-decoration-none fs-base-p4">
						<i className="fa-regular fa-question-circle"></i>
						<span className="visually-hidden">Help</span>
					</a>
					<span className="ms-auto text-muted">
						&copy; 2022, SP Tech Inc.<span className="d-none d-sm-inline"> All rights reserved</span>
					</span>
				</div>
				{/* Footer end */}

			</div>
			{/* Content wrapper end */}

		</div>
	)
}
