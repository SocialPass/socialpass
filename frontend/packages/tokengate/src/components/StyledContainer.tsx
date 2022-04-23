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
		<div className="container">
			<header>
				<TickerImage gateType={retrieveJson?.general_type}/>
				<img src={headerImage} alt="image"/>
				{retrieveJson &&
					<div className="team-info">
						<img className="team-header" src={retrieveJson?.team.image} alt="Team Image"/>
						<h4>{retrieveJson?.team.name}</h4>
					</div>
				}
			</header>
			<div className="parent">
				{children}
			</div>
			<footer className="footer">
				<img src={FAQImage} alt="image"/>
				<small style={{display:'flex',alignItems:'center'}}>
					Powered by &nbsp;
					<img src={logoImage} alt="image"/>
				</small>
			</footer>
		</div>
	)
}
