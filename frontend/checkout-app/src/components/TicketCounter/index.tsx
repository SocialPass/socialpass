import propTypes from 'prop-types'

function TicketCounter(props): JSX.Element {
  const { ticketTier, paymentType, value, onChange, isChecked } = props

  const handleAddOne = () => {
    if (value < ticketTier?.capacity) {
      onChange(value + 1, ticketTier)
    }
  }

  const handleSubtractOne = () => {
    if (value > 0) {
      onChange(value - 1, ticketTier)
    }
  }

  const getPriceWithCurrencySymbol = (value) => {
    if (paymentType === 'tier_fiat') {
      return `$${value}`
    } else if (paymentType === 'tier_cryptocurrency') {
      return `${value} ETH`
    }

    return 'N/A'
  }

  return (
    <div className='ticket-tier mb-20'>
      <input type='checkbox' className='ticket-tier-input' id='c1' checked={isChecked} />
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
              <div className='form-control form-number text-center'>{value}</div>
              <button className='btn ws-25 px-0' onClick={handleAddOne}>
                +
              </button>
            </div>

            {paymentType !== 'tier_asset_ownership' ? (
              <div className='text-center fs-base-n2 mt-5'>
                <strong>Price &times; {value}</strong> &mdash;{' '}
                {getPriceWithCurrencySymbol(ticketTier[paymentType]?.price * value)}
              </div>
            ) : null}
          </div>
        </div>
        {paymentType === 'tier_asset_ownership' ? (
          <div className='border-top mt-10 pt-10 fs-base-n2'>
            <div>
              Free for all holders of 1 NFT from collection — <strong>Bubbs</strong>
            </div>
            <div>
              <strong>Contract</strong> — {ticketTier[paymentType]?.contract_address}
            </div>
          </div>
        ) : null}
      </label>
    </div>
  )
}

export default TicketCounter

TicketCounter.propTypes = {
  value: propTypes.number,
  ticketTier: propTypes.object,
  paymentType: propTypes.string,
  onChange: propTypes.func,
  isChecked: propTypes.bool,
}
