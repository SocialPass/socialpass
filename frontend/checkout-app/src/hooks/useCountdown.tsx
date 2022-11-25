import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();
    let gap = Math.floor(((countDownDate - (new Date().getTime()))) / 1000);
    const [countDown, setCountDown] = useState(gap);

    useEffect(() => {
        setInterval(() => {
            setCountDown(gap);
        }, 1000);
    },);
    console.log(countDown)
    return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    console.log("getReturnValues", days, hours, minutes, seconds)
    return { days, hours, minutes, seconds };
};

export { useCountdown };
