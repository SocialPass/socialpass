import React from 'react';
import { Link } from "react-router-dom";
import { TokenGate } from '@nfty/sdk';

function DayTwo() {
  return (
	<>
	  <main>
		<h2>Welcome to the Day Two!</h2>
		<TokenGate type='TICKET'/>
	  </main>
	  <nav>
		<Link to="/day-one">Day One</Link>
		<Link to="/day-two">Day Two</Link>
	  </nav>
	</>
  );
}

export default DayTwo;
