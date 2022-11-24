import { useNavigate, useParams } from 'react-router-dom'
import { useCountdown } from '@/hooks/useCountdown';
import useCheckout from '@/hooks/useCheckout';
import propTypes from 'prop-types';

function CountdownTimer(props): JSX.Element {
    const { expiration } = props
    const { checkout, setCheckout, setCheckoutItems }: any = useCheckout()
    const { eventPublicId } = useParams()
    const navigate = useNavigate()

    const { minutes, seconds } = useCountdown(expiration)

    function handleFinishedCountown() {
        if (minutes + seconds <= 0) {
            setCheckout(null)
            setCheckoutItems([])
            navigate(`/${eventPublicId}`)
        }
    }

    function zeroLeft(number) {
        return String(number).padStart(2, '0')
    }


    return (
        <div className='py-20 w-100 h-100'>
            {handleFinishedCountown()}
            <div className='d-flex align-items-center mt-10 px-10 py-5 rounded bg-gray-very-light-lm bg-darkgray-very-dim-dm border border-dotted fs-base-n2'>
                <div className='ws-25 flex-shrink-0'>
                    <i className='fa-regular fa-alarm-clock'></i>
                </div>
                <div className='pe-5'>
                    Checkout time remaining:
                </div>
                <div className='fw-bold'>
                    {(isNaN(minutes)) ? '' : zeroLeft(minutes) + ' : '}{(isNaN(seconds)) ? '' : zeroLeft(seconds)}
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer



CountdownTimer.propTypes = {
    counter: propTypes.number,
    expiration: propTypes.any
};
