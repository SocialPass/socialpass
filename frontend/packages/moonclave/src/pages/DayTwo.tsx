import React from 'react';
import { Link } from "react-router-dom";

function DayTwo() {
  return (
	<>
	  <main>
		<h2>Welcome to the Day Two!</h2>
	  </main>
	  <nav>
		<Link to="/">Home</Link>
	  </nav>
	</>
  );
}

export default DayTwo;