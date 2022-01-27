import React from 'react';
import { Link } from "react-router-dom";
import { TokenGate } from '@nfty/sdk';

function DayTwo() {
  return (
	<>
	  <main>
		<h2>Welcome to the Day Two!</h2>
		<TokenGate id={2} gateType='TICKET'/>
	  </main>
	</>
  );
}

export default DayTwo;
