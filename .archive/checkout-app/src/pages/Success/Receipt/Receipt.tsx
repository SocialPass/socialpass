import { useNavigate } from "react-router-dom";

import useCheckout from "@/hooks/useCheckout";
import useEvent from "@/hooks/useEvent";

export default function Summary() {
	const navigate = useNavigate();

	const { event }: any = useEvent();
	const { checkout, checkoutItems, getTxType, setCheckout, setCheckoutItems }: any =
		useCheckout();

	const getTotalPrice = () => {
		return checkoutItems.reduce((acc, item) => {
			return acc + item.ticket_tier[getTxType(checkout?.tx_type)]?.price * item.quantity;
		}, 0);
	};

	const getPriceWithCurrencySymbol = (value) => {
		if (checkout?.tx_type === "FIAT") {
			return `$${value}`;
		} else if (checkout?.tx_type === "BLOCKCHAIN") {
			return `${value} ETH`;
		}
		// The asset_ownership modality does not have currency
		return "N/A";
	};

	// const downloadReceipt = () => {}

	const orderAgain = () => {
		navigate(`/${event.public_id}`);
		setCheckout(null);
		setCheckoutItems([]);
		// when ordering again the checkout items will be emptied
	};

	return (
		<>
			<div className='px-content pt-md-20 position-md-sticky top-0 start-0'>
				<h6 className='fw-700 fsr-6 mt-0 mb-10'>Receipt</h6>

				{checkoutItems.map((item: any) => (
					<div className='py-10 border-top' key={`checkout-item-${item.public_id}`}>
						<h6 className='fw-700 m-0 fs-base d-flex align-items-center'>
							<span>{item.ticket_tier.ticket_type}</span>
							<span className='ms-auto ps-10 fw-normal'>&times; {item.quantity}</span>
						</h6>
						<div className='fs-base-n2 text-muted'>Extra Guest(s): {item.extra_party}</div>
						<div className='fs-base-n2 mt-5'>
							<strong>Price</strong> &mdash;{" "}
							{getPriceWithCurrencySymbol(
								item.ticket_tier[getTxType(checkout?.tx_type)]?.price,
							)}
						</div>
					</div>
				))}

				{/* <button
          className='btn btn-secondary btn-lg fsr-6 btn-block mt-15'
          onClick={() => downloadReceipt()}
        >
          <strong className='antialiased'>Download Receipt</strong>
        </button> */}

				<p>
					<strong>Total Price</strong> &mdash;{" "}
					{getPriceWithCurrencySymbol(getTotalPrice())}
				</p>

				<hr />

				<p className='fs-base-n2'>Want to buy more tickets?</p>

				<button
					className='btn btn-lg btn-block px-20 py-10 fs-base text-base'
					onClick={() => orderAgain()}
				>
					<i className='fa-regular fa-rotate-right me-5'></i>
					<strong className='antialiased'>Order Again</strong>
				</button>
			</div>
		</>
	);
}
