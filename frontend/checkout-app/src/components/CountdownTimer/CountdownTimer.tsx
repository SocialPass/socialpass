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
        <div className='py-20 w-100 h-100'>
            <div className='d-flex align-items-center'>
                <div className='ws-25 flex-shrink-0'>
                    <i className='fa-regular fa-clock'></i>
                </div>
                <div className='fw-bold'>{(isNaN(minutes)) ? '' : zeroLeft(minutes) + ' : '}{(isNaN(seconds)) ? '' : zeroLeft(seconds)}</div>
            </div>

            <div className='bg-gray fs-14'> After this time the tickets will be available to general purchase.
            </div>

        </div>
    );
}

export default CountdownTimer



CountdownTimer.propTypes = {
    counter: propTypes.number,
    expiration: propTypes.any
};
