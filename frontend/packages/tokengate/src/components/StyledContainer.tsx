import React, { useContext } from 'react';
import { TickerImage } from './TickerImage';
import { TokenGateContext } from '../context';

// StyledContainer component
// Display root layout (header, main content, footer)
export const StyledContainer = ({children}:{children:React.ReactNode}) => {
	const { retrieveJson } = useContext(TokenGateContext);
	const headerImage = require("../static/images/header1.svg");
	const FAQImage = require("../static/images/FAQ.svg");
	const logoImage = require("../static/images/socialpass.svg");

	return (
		<div className="container-fluid h-100 d-flex flex-column p-0">
			<header style={{ backgroundImage: `url(${headerImage})`, minHeight: '150px', height: '27.9%'}}>
				<TickerImage gateType={retrieveJson?.general_type}/>
				<div className="team-info">
					<img src={retrieveJson?.team.image} alt="Team Image"/>
					<h4>{retrieveJson?.team.name}</h4>
				</div>
			</header>
			<div className="d-flex align-items-center flex-grow-1 px-5">
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
