import { useNavigate, useParams } from 'react-router-dom'
import { useCountdown } from '@/hooks/useCountdown';
import propTypes from 'prop-types';

function CountdownTimer(props): JSX.Element {
    const { expiration } = props

    const { eventPublicId } = useParams()
    const navigate = useNavigate()

    const { minutes, seconds } = useCountdown(expiration)

    function handleFinishedCountown() {
        if (minutes + seconds <= 0) {
            navigate(`/${eventPublicId}`)
        }
    }

    function zeroLeft(number) {
        return String(number).padStart(2, '0')
    }


    return (
        <div className='py-20 w-100 h-100'>
            {handleFinishedCountown()}
            <div className='d-flex align-items-center'>
                <div className='ws-25 flex-shrink-0'>
                    <i className='fa-regular fa-clock'></i>
                </div>
                <div className='fw-bold'>{(isNaN(minutes)) ? '' : zeroLeft(minutes) + ' : '}{(isNaN(seconds)) ? '' : zeroLeft(seconds)}</div>
            </div>
            <div className='mt-10 px-10 py-5 rounded bg-gray-very-light-lm bg-darkgray-very-dim-dm border border-dotted fs-base-n2'>
                After this time, the tickets you have selected will be available for general purchase.
            </div>
        </div>
    );
}

export default CountdownTimer



CountdownTimer.propTypes = {
    counter: propTypes.number,
    expiration: propTypes.any
};
