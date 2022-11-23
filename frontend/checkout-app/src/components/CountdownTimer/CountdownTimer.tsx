import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import propTypes from "prop-types";

function CountdownTimer(props): JSX.Element {
    const { expiration } = props
    const expirationDate = new Date(new Date(expiration).getTime());
    const currentDate = new Date()

    const [expire, setExpire] = useState({ slotMinutes: 0, slotSeconds: 0 })

    let timeInSeconds = Math.abs((currentDate.getTime() - expirationDate.getTime()) / 1000);
    let slotSeconds
    let slotMinutes;
    const navigate = useNavigate()
    const handleRedirectSession = () => {
        navigate(`/`)
    }

    const [timer, setTimer] = useState(timeInSeconds);

    let counter = setInterval(() => {
        slotMinutes = Math.floor(((expirationDate.getTime() - currentDate.getTime()) % 3600000) / 60000)
        slotSeconds = Math.floor(((expirationDate.getTime() - currentDate.getTime()) % 60000) / 1000)
        setExpire({ slotMinutes, slotSeconds })
        console.log("expire", expire)
    }, 1000)

    // useEffect(() => {
    //     return () => clearInterval(counter)
    // }, []);

    // useEffect(() => {
    //     if ((expirationDate.getTime() - currentDate.getTime()) <= 0) {
    //         console.log("Timer reached 0");
    //         handleRedirectSession()
    //         setTimer(timeInSeconds)
    //     }
    // }, [timer]);



    return (
        <div>
            <div>{(expire.slotMinutes < 10) ? ("0" + expire.slotMinutes) : expire.slotMinutes} : {(expire.slotSeconds < 10) ? ("0" + expire.slotSeconds.toFixed(0)) : expire.slotSeconds.toFixed(0)} </div>
        </div>
    );
}

export default CountdownTimer



CountdownTimer.propTypes = {
    counter: propTypes.number,
    expiration: propTypes.any
};
