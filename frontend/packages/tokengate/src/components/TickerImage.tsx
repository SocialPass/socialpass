import React, { useContext } from 'react';
import { TokenGateContext } from '../context';

// TickerImage component
// Displays ticker tape in header top right corner for type of gate
export const TickerImage = () => {
	const { gateType } = useContext(TokenGateContext);
	switch(gateType){
		case 'TICKET':
			return <img className="ticker" src={require("../static/images/gates/ticket.svg")} alt="image"/>

		default:
			return null;
	}
}
