import propTypes from 'prop-types'

function TicketSelector(props): JSX.Element {
  const { ticketTier, paymentType, amount, onChange, isChecked } = props

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

  const getPriceWithCurrencySymbol = (amount) => {
    if (paymentType === 'FIAT') {
      return `$${amount}`
    } else if (paymentType === 'BLOCKCHAIN') {
      return `${amount} ETH`
    }
    // The asset_ownership modality does not have currency
    return 'N/A'
  }

  return (
    <div className='ticket-tier mb-20'>
      <input type='checkbox' className='ticket-tier-input' id='c1' checked={isChecked} readOnly />
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
            </h6>
            <p className='m-0 fs-base-n2'>{ticketTier?.capacity} available</p>
          </div>

          <div className='ticket-tier-controls ms-auto mt-10 mt-sm-0'>
            <div className='input-group input-group-sm input-group-pill ws-100 mx-auto'>
              <button className='btn ws-25 px-0' onClick={handleSubtractOne}>
                -
              </button>
              <div className='form-control form-number text-center'>{amount}</div>
              <button className='btn ws-25 px-0' onClick={handleAddOne}>
                +
              </button>
            </div>

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
            <div>
              Free for all holders of 1 {ticketTier.tier_asset_ownership.asset_type} from collection
              — <strong>{ticketTier.tier_asset_ownership.blockchain}</strong>
            </div>
            <div>
              <strong>Contract</strong> — {ticketTier.tier_asset_ownership?.token_address}
            </div>
          </div>
        ) : null}
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
}
