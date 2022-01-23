import React from 'react';

interface GreetingProps {
	whom?: string
}

const Greeting: React.FC<GreetingProps> = ({ whom = 'World' }) => {
	return (
		<h1>hello {whom}</h1>
	);
}

export default Greeting;