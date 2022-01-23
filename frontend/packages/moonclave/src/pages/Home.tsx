import React from 'react';
import { Link } from "react-router-dom";

function Home() {
  return (
	<>
	  <main>
		<h2>Welcome to the Home!</h2>
	  </main>
	  <ul>
		<li><Link to="/day-one">Day One</Link></li>
		<li><Link to="/day-two">Day Two</Link></li>
	  </ul>
	</>
  );
}

export default Home;