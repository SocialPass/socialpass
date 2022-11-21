import { useState, useEffect } from 'react'
import propTypes from 'prop-types'


function CountdownTimer(props): JSX.Element {
    const { totalTime } = props
    const [counter, setCounter] = useState(totalTime)


    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);


    return (
        <div>
            <div>Counter: {counter}</div>
        </div>
    )
}

export default CountdownTimer


CountdownTimer.propTypes = {
    counter: propTypes.number,
    totalTime: propTypes.number,
}
