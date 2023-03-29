import propTypes from 'prop-types'

function TicketSelector(props): JSX.Element {
  const { ticketTier, paymentType, amount, onChange, isChecked, partySize, setPartySize } = props

  const isTierAvailable = () => {
    if (ticketTier?.capacity > ticketTier?.quantity_sold) {
      return true
    } else {
      return false
    }
  }

  const handleAddOne = () => {
    if (
      amount < ticketTier?.capacity &&
      amount < ticketTier?.max_per_person &&
      amount < ticketTier?.capacity - ticketTier?.quantity_sold
      // Current rules state limits to ticket selection:
      // Can't go below zero
      // Can't select more than the capacity, max per person ou more than are tickets available
    ) {
      onChange(amount + 1, ticketTier)
    }
  }

  const handleSubtractOne = () => {
    if (amount > 0) {
      onChange(amount - 1, ticketTier)
    }
  }

  const handleAddOneParty = () => {
    if (
      partySize < ticketTier?.allowed_guests
      // Current rules state limits to ticket selection:
      // Can't select more than the guests allowed
    ) {
      setPartySize(partySize + 1)
    }
  }

  const handleSubtractOneParty = () => {
    if (partySize > 0) {
      setPartySize(partySize - 1)
    }
  }

  const getPriceWithCurrencySymbol = (amount) => {
    if (paymentType === 'FIAT') {
      return `$${amount}`
    } else if (paymentType === 'BLOCKCHAIN') {
      return `${amount} ETH`
    }
    // The asset_ownership modality does not have currency
    return 'N/A'
  }

  const handleCardClick = () => {
    if (amount === 0) {
      handleAddOne()
    } else {
      onChange(0, ticketTier)
      setPartySize(0)
    }
  }

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
                  {' | +' + ticketTier?.allowed_guests + ' Guest(s) Allowed'}
                </span>
              )}
            </h6>

            <p className='m-0 fs-base-n2'>
              {ticketTier?.capacity - ticketTier?.quantity_sold} available
            </p>
          </div>

          <div className='ticket-tier-controls ms-auto mt-10 mt-sm-0'>
            <div className='input-group input-group-sm input-group-pill ws-100 mx-auto'>
              <button
                className='btn ws-25 px-0'
                onClick={(e) => {
                  e.stopPropagation()
                  handleSubtractOne()
                }}
              >
                -
              </button>
              <div className='form-control form-number text-center'>{amount}</div>
              <button
                className='btn ws-25 px-0'
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddOne()
                }}
              >
                +
              </button>
            </div>

            {paymentType === 'ASSET_OWNERSHIP' ? (
              <div className='text-center fs-12 mt-5'>
                Max {ticketTier?.max_per_person} per person
              </div>
            ) : null}

            {paymentType !== 'ASSET_OWNERSHIP' && amount > 0 ? (
              <div className='text-center fs-base-n2 mt-5'>
                <strong>Price &times; {amount}</strong> &mdash;{' '}
                {getPriceWithCurrencySymbol(ticketTier[paymentType]?.price * amount)}
              </div>
            ) : null}
            {paymentType !== 'ASSET_OWNERSHIP' && amount == 0 ? (
              <div className='text-center fs-base-n2 mt-5'>
                <strong>Price: &times; 1 </strong>
                &mdash; {getPriceWithCurrencySymbol(ticketTier[paymentType]?.price)}
              </div>
            ) : null}
          </div>
        </div>
        {paymentType === 'ASSET_OWNERSHIP' ? (
          <div className='border-top mt-10 pt-10 fs-base-n2'>
            <div>Free for all holders of the following:</div>
            <div className='row mt-10'>
              <div className='col-6'>
                <strong>Blockchain</strong>
                <br />
                {ticketTier.tier_asset_ownership.blockchain}
              </div>
              <div className='col-6'>
                <strong>Network</strong>
                <br />
                {ticketTier.tier_asset_ownership.network}
              </div>
            </div>
            <div className='row mt-10'>
              <div className='col-6'>
                <strong>Asset Type</strong>
                <br />
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
        {ticketTier && ticketTier.allowed_guests > 0 ?
        <div className='ticket-tier-controls border-top mt-10 pt-10'>
					<div className='d-flex align-items-center'>
						<div>
							<div className='fw-bold fs-base-n2'>Party Size</div>
							<div className='fs-base-n4 lh-sm'>
								Including ticket holder and guest(s).
							</div>
						</div>
						<div className='ps-20 flex-shrink-0 ms-auto'>
							<div className='input-group input-group-sm ws-100'>
								<button
									className='btn ws-25 px-0'
									onClick={(e) => {
										e.stopPropagation()
										handleSubtractOneParty()
									}}
								>
									-
								</button>
								<div className='form-control form-number text-center'>{partySize}</div>
								<button
									className='btn ws-25 px-0'
									onClick={(e) => {
										e.stopPropagation()
										handleAddOneParty()
									}}
								>
									+
								</button>
							</div>
						</div>
					</div>
				</div>
        : null}
      </label>
    </div>
  )
}

export default TicketSelector

TicketSelector.propTypes = {
  amount: propTypes.number,
  ticketTier: propTypes.object,
  paymentType: propTypes.string,
  onChange: propTypes.func,
  isChecked: propTypes.bool,
  partySize: propTypes.number,
  setPartySize: propTypes.func,
}
