import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Base() {
	return (
		<div className="page-wrapper">

			{/* Content wrapper start */}
			<div className="content-wrapper mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column" style={{ width: "860px" }}>

				{/* Render Child Route Start */}
				<Outlet/>
				{/* Render Child Route End */}

				{/* Footer start */}
				<div className="content d-flex align-items-center">
					<i className="fa-regular fa-question-circle fs-base-p4 text-secondary"></i>
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
