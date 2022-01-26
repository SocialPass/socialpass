import React from 'react';
import { Link } from "react-router-dom";
import { TokenGate } from '@nfty/sdk';

function DayOne() {
  return (
	<>
	  <main>
		<h2>Welcome to the Day One!</h2>
		<TokenGate type='EVENT'/>
	  </main>
	  <nav>
		<Link to="/day-one">Day One</Link>
		<Link to="/day-two">Day Two</Link>
	  </nav>
	</>
  );
}

export default DayOne;
