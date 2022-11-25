import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCountdown } from '@/hooks/useCountdown';
import useCheckout from '@/hooks/useCheckout';
import propTypes from 'prop-types';

function CountdownTimer(props): JSX.Element {
	const { expiration } = props
	const { setCheckout, setCheckoutItems }: any = useCheckout()
	const { eventPublicId } = useParams()
    const navigate = useNavigate()
	const { minutes, seconds } = useCountdown(expiration)
    console.log("useCountdown: ", useCountdown(expiration))

	function handleFinishedCountown() {
		if (minutes + seconds <= 0) {
			setCheckout(null)
			setCheckoutItems([])
			navigate(`/${eventPublicId}`)
			alert("Your checkout session timer has run out. Please try again.")
		}
	}

	function zeroLeft(number) {
		return String(number).padStart(2, '0')
	}

	useEffect(() => {
		handleFinishedCountown()
	})


	return (
		<div className='w-100 h-100 mb-10'>
			<div className='text-center px-10 py-5 rounded bg-gray-very-light-lm bg-darkgray-very-dim-dm border border-dotted'>
				<div>
					<i className='fa-light fa-alarm-clock me-10'></i>
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
