import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { EventPortalContext } from '../context';

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({children}:{children:React.ReactNode}) => {
	const { backButton, retrieveJson } = useContext(EventPortalContext);
	const location = useLocation();
	const headerImage = require("../static/images/header1.svg");
	const FAQImage = require("../static/images/FAQ.svg");
	const logoImage = require("../static/images/socialpass.svg");
	const _backButton = require("../static/images/back.svg");
	console.log(location)
	return (
		<div className="container-fluid p-0 d-flex flex-column">
			{
				location.pathname.includes('checkout')
				?
				<header className="small-header" style={{backgroundImage: `url(${headerImage})`}}>
						{backButton &&
						<div className="back" onClick={() => backButton()}>
							<img src={_backButton} alt="Back Button" height="24" width="24"/>
							<h4 className="ps-2 m-0">Go back</h4>
						</div>
						}
					<div className="small-team-info">
						<h4>{retrieveJson?.title}</h4>
						<h5>by: {retrieveJson?.team.name}</h5>
					</div>
				</header>
				:
				<header className="header" style={{backgroundImage: `url(${headerImage})`}}>
					<div className="team-info mx-3 mx-md-5 ps-2">
						<img src={retrieveJson?.team.image} alt="Team Image"/>
						<h4>{retrieveJson?.team.name}</h4>
					</div>
				</header>
			}
			<div className="d-flex mx-3 mx-md-5 mt-5 flex-grow-1 h-100">
				{children}
			</div>
			<footer>
				<img src={FAQImage} alt="image"/>
				<small>
					Powered by &nbsp;
					<img src={logoImage} alt="image"/>
				</small>
			</footer>
		</div>
	)
}
