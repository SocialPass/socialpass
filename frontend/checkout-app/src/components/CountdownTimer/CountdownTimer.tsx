import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import propTypes from "prop-types";

function CountdownTimer(props): JSX.Element {
    const { expiration } = props
    const expirationDate = new Date(new Date(expiration).getTime());
    const currentDate = new Date()

    let timeInSeconds = Math.abs((currentDate.getTime() - expirationDate.getTime()) / 1000);
    let slotSeconds
    let slotMinutes;
    const navigate = useNavigate()
    const handleRedirectSession = () => {
        navigate(`/`)
    }

    const [timer, setTimer] = useState(timeInSeconds);

    useEffect(() => {
        console.log(expiration)
        console.log(expirationDate)
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
            <div>{(slotMinutes < 10) ? ("0" + slotMinutes) : slotMinutes} : {(slotSeconds < 10) ? ("0" + slotSeconds) : Math.floor(slotSeconds)} </div>
        </div>
    );
}

export default CountdownTimer



CountdownTimer.propTypes = {
    counter: propTypes.number,
    expiration: propTypes.any
};
