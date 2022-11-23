import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useCountdown } from "@/hooks/useCountdown";
import propTypes from "prop-types";

function CountdownTimer(props): JSX.Element {
    const { expiration } = props

    const navigate = useNavigate()

    const { minutes, seconds } = useCountdown(expiration)
    console.log(useCountdown(expiration))

    if (minutes + seconds <= 0) {
        navigate(`/`)
    }

    function zeroLeft(number) {
        return String(number).padStart(2, '0')
    }


    return (
        <div>
            {(isNaN(minutes)) ? '' : zeroLeft(minutes) + ' : '}{(isNaN(seconds)) ? '' : zeroLeft(seconds)}
        </div>
    );
}

export default CountdownTimer



CountdownTimer.propTypes = {
    counter: propTypes.number,
    expiration: propTypes.any
};
