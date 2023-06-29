import propTypes from "prop-types";

function TicketSelector(props): JSX.Element {
	const { ticketTier, paymentType, amount, onChange, isChecked, extraParty } = props;

	const isTierAvailable = () => {
		if (ticketTier?.capacity > ticketTier?.quantity_sold) {
			return true;
		} else {
			return false;
		}
	};

	const handleAddOne = () => {
		if (
			amount < ticketTier?.capacity &&
			amount < ticketTier?.max_per_person &&
			amount < ticketTier?.capacity - ticketTier?.quantity_sold
			// Current rules state limits to ticket selection:
			// Can't go below zero
			// Can't select more than the capacity, max per person ou more than are tickets available
		) {
			const totalSelected = amount + 1 + (amount + 1) * extraParty;
			const totalAvailable = ticketTier?.capacity - ticketTier?.quantity_sold;
			if (totalSelected <= totalAvailable) {
				onChange(amount + 1, extraParty, ticketTier);
			}
		}
	};

	const handleSubtractOne = () => {
		if (amount > 0) {
			onChange(amount - 1, extraParty, ticketTier);
		}
	};

	const handleAddOneParty = () => {
		if (
			extraParty < ticketTier?.allowed_guests
			// Current rules state limits to ticket selection:
			// Can't select more than the guests allowed
		) {
			const totalSelected = amount + amount * (extraParty + 1);
			const totalAvailable = ticketTier?.capacity - ticketTier?.quantity_sold;
			if (totalSelected <= totalAvailable) {
				onChange(amount, extraParty + 1, ticketTier);
			}
		}
	};

	const handleSubtractOneParty = () => {
		if (extraParty > 0) {
			onChange(amount, extraParty - 1, ticketTier);
		}
	};

	const getPriceWithCurrencySymbol = (amount) => {
		if (paymentType === "FIAT") {
			return `$${amount}`;
		} else if (paymentType === "BLOCKCHAIN") {
			return `${amount} ETH`;
		}
		// The asset_ownership modality does not have currency
		return "N/A";
	};

	const handleCardClick = () => {
		if (amount === 0) {
			handleAddOne();
		} else {
			onChange(0, 0, ticketTier);
		}
	};

	return (
		<div className='ticket-tier mb-20' onClick={() => handleCardClick()}>
			<input
				disabled={!isTierAvailable()}
				type='checkbox'
				className='ticket-tier-input'
				checked={isChecked}
				readOnly
			/>
			<label htmlFor='c1' className='ticket-tier-label'>
				<div className='d-sm-flex align-items-center'>
					<div className='pe-sm-15'>
						<h6 className='fw-700 m-0 fs-base'>
							<span className='ticket-tier-uncheck'>
								<i className='fa-light fa-square'></i>
							</span>

							<span className='ticket-tier-check'>
								<i className='fa-light fa-check-square'></i>
							</span>

							{ticketTier?.ticket_type}
							{ticketTier?.allowed_guests > 0 && (
								<span className="fw-400 fs-base-n2">
									{" | +" + ticketTier?.allowed_guests + " Guest(s) Allowed"}
								</span>
							)}
						</h6>

						<p className='m-0 fs-base-n2'>
							{ticketTier?.capacity - ticketTier?.quantity_sold > 0
								? ticketTier?.capacity - ticketTier?.quantity_sold
								: 0}{" "}
							available
						</p>
					</div>

					<div className='ticket-tier-controls ms-auto mt-10 mt-sm-0'>
						<div className='input-group input-group-sm input-group-pill ws-100 mx-auto'>
							<button
								className='btn ws-25 px-0'
								onClick={(e) => {
									e.stopPropagation();
									handleSubtractOne();
								}}
							>
								-
							</button>
							<div className='form-control form-number text-center'>{amount}</div>
							<button
								className='btn ws-25 px-0'
								onClick={(e) => {
									e.stopPropagation();
									handleAddOne();
								}}
							>
								+
							</button>
						</div>

						{paymentType === "ASSET_OWNERSHIP" || paymentType === "FREE" ? (
							<div className='text-center fs-12 mt-5'>
								Max {ticketTier?.max_per_person} per person
							</div>
						) : null}
						{(paymentType === "FIAT" || paymentType === "BLOCKCHAIN") && amount > 0 ? (
							<div className='text-center fs-base-n2 mt-5'>
								<strong>Price &times; {amount}</strong> &mdash;{" "}
								{getPriceWithCurrencySymbol(ticketTier[paymentType]?.price * amount)}
							</div>
						) : null}
						{(paymentType === "FIAT" || paymentType === "BLOCKCHAIN") && amount == 0 ? (
							<div className='text-center fs-base-n2 mt-5'>
								<strong>Price: &times; 1 </strong>
								&mdash; {getPriceWithCurrencySymbol(ticketTier[paymentType]?.price)}
							</div>
						) : null}
					</div>
				</div>
				{paymentType === "ASSET_OWNERSHIP" ? (
					<div className='border-top mt-10 pt-10 fs-base-n2'>
						<div>Free for all holders of the following:</div>
						<div className='row mt-10'>
							<div className='col-6'>
								<strong>Blockchain</strong>
								<br />
								<div className='d-flex align-items-center'>
									{ticketTier.tier_asset_ownership.blockchain === "Ethereum" && (
										<img
											src='https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png'
											alt='Ethereum'
											className='d-block me-5'
											height='16'
										></img>
									)}
									{ticketTier.tier_asset_ownership.blockchain}
								</div>
							</div>
							<div className='col-6'>
								<strong>Network</strong>
								<br />
								{ticketTier.tier_asset_ownership.network === "Ethereum" ? (
									<span>Ethereum Mainnet</span>
								) : (
									<span>{ticketTier.tier_asset_ownership.network}</span>
								)}
							</div>
						</div>
						<div className='row mt-10'>
							<div className='col-6'>
								<strong>Asset Type</strong>
								<br />
								<i className='fa-light fa-hexagon-image me-5'></i>
								{ticketTier.tier_asset_ownership.asset_type}
							</div>
							<div className='col-6 text-truncate'>
								<strong>Token Address</strong>
								<br />
								{ticketTier.tier_asset_ownership?.token_address}
							</div>
						</div>
					</div>
				) : null}
				{paymentType === "FREE" ? (
					<div className='border-top mt-10 pt-10 fs-base-n2'>
						<div>
							<i className='fa-light fa-info-circle me-5'></i>
							<strong>This is a FREE ticket tier</strong>
						</div>
						<div className='text-muted mt-5'>
							You can claim ticket(s) as long as they are available. First come, first
							served!
						</div>
					</div>
				) : null}
				{ticketTier && ticketTier.allowed_guests > 0 && isChecked ? (
					<div className='ticket-tier-controls border-top mt-10 pt-10'>
						<div className='d-sm-flex align-items-center'>
							<div>
								<div className='fw-bold'>Extra Guest(s) - Free</div>
								<div className='fs-base-n4 lh-sm'>
									Please set the number of guest(s) you want to bring.
								</div>
							</div>
							<div className='mt-10 mt-sm-0 ps-sm-20 flex-shrink-0 ms-auto'>
								<div className='input-group input-group-sm ws-100 mx-auto'>
									<button
										className='btn ws-25 px-0'
										onClick={(e) => {
											e.stopPropagation();
											handleSubtractOneParty();
										}}
									>
										-
									</button>
									<div className='form-control form-number text-center'>{extraParty}</div>
									<button
										className='btn ws-25 px-0'
										onClick={(e) => {
											e.stopPropagation();
											handleAddOneParty();
										}}
									>
										+
									</button>
								</div>
							</div>
						</div>
						<div className='border-top text-end mt-15 pt-10 fs-base-n2'>
							<strong>Total:</strong> {amount + amount * extraParty} (Quantity + Quantity
							&times; Guests)
						</div>
					</div>
				) : null}
			</label>
		</div>
	);
}

export default TicketSelector;

TicketSelector.propTypes = {
	amount: propTypes.number,
	ticketTier: propTypes.object,
	paymentType: propTypes.string,
	onChange: propTypes.func,
	isChecked: propTypes.bool,
	extraParty: propTypes.number,
};