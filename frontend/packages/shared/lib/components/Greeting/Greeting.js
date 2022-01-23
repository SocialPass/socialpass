import React from 'react';
const Greeting = ({ whom = 'World' }) => {
    return (React.createElement("h1", null,
        "poop ",
        whom));
};
export default Greeting;
