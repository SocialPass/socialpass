import React from 'react';
import { Link } from "react-router-dom";
import { TokenGate } from '@nfty/sdk';

function Airdrop() {
  return (
	<>
	  <main>
		<TokenGate gateType="AIRDROP" id={1}/>
	  </main>
	</>
  );
}

export default Airdrop;
