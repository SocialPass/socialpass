import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { TickerImage } from './TickerImage';
import { TokenGateContext } from '../context';

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({children}:{children:React.ReactNode}) => {
	const { retrieveJson } = useContext(TokenGateContext);
	const location = useLocation();
	const headerImage = require("../static/images/header1.svg");
	const FAQImage = require("../static/images/FAQ.svg");
	const logoImage = require("../static/images/socialpass.svg");

	return (
		<div className="container-fluid h-100 d-flex flex-column p-0">
			{
				location.pathname.includes("/checkout")
				?
				<header className="small-header" style={{backgroundImage: `url(${headerImage})`}}>
					<TickerImage gateType={retrieveJson?.general_type}/>
					<div className="small-team-info">
						<h4>{retrieveJson?.team.name}</h4>
					</div>
				</header>
				:
				<header className="header" style={{backgroundImage: `url(${headerImage})`}}>
					<TickerImage gateType={retrieveJson?.general_type}/>
					<div className="team-info">
						<img src={retrieveJson?.team.image} alt="Team Image"/>
						<h4>{retrieveJson?.team.name}</h4>
					</div>
				</header>
			}

			<div className="d-flex flex-grow-1 p-4">
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
