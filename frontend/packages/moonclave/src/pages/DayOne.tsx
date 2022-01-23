import React from 'react';
import { Link } from "react-router-dom";

function DayOne() {
  return (
	<>
	  <main>
		<h2>Welcome to the Day One!</h2>
	  </main>
	  <nav>
		<Link to="/">Home</Link>
	  </nav>
	</>
  );
}

export default DayOne;