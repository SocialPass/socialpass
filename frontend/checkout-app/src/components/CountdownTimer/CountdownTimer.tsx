import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import propTypes from "prop-types";

export default function CountdownTimer() {
    const expirationDate = new Date(new Date().getTime() + 15 * 60000);
    const checkoutDate = new Date()

    var timeInSeconds = Math.abs((expirationDate.getTime() - checkoutDate.getTime()) / 1000);
    let slotSeconds
    let slotMinutes;
    const navigate = useNavigate()
    const handleRedirectSession = () => {
        navigate(`/`)
    }

    const [timer, setTimer] = useState(timeInSeconds);

    useEffect(() => {
        setInterval(() => {
            setTimer((time) => time - 1);
        }, 1000);
        return () => console.log("Session has expired");
    }, []);

    useEffect(() => {
        if (timer === 0) {
            console.log("Timer reached 0");
            handleRedirectSession()
            setTimer(timeInSeconds)
        }
    }, [timer]);

    slotMinutes = Math.floor(timer / 60)
    slotSeconds = timer - slotMinutes * 60

    return (
        <div>
            <div>{(slotMinutes < 10) ? ("0" + slotMinutes) : slotMinutes} : {(slotSeconds < 10) ? ("0" + slotSeconds) : slotSeconds} </div>
        </div>
    );
}

CountdownTimer.propTypes = {
    counter: propTypes.number
};
