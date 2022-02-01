import React from 'react';
import { Link } from "react-router-dom";
import { TokenGate } from '@nfty/sdk';

function Ticketing() {
  return (
	<>
	  <main>
		<h2>Ticketing Demo</h2>
		<TokenGate gateType="TICKET" id={1}/>
	  </main>
	</>
  );
}

export default Ticketing;
