import React from 'react';

interface SampleProps {
	whom?: string
}

const Sample: React.FC<SampleProps> = ({ whom = 'World' }) => {
	return (
		<h1>hello {whom}</h1>
	);
}

export default Sample;
