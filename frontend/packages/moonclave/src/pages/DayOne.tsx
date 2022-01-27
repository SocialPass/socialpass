import React from 'react';
import { Link } from "react-router-dom";
import { TokenGate } from '@nfty/sdk';

function DayOne() {
  return (
	<>
	  <main>
		<h2>Welcome to the Day One!</h2>
		<TokenGate id={1} gateType='AIRDROP'/>
	  </main>
	</>
  );
}

export default DayOne;
