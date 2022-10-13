import propTypes from 'prop-types'

function TicketCounter(props): JSX.Element {
  const { ticketTier, paymentType, value, onChange } = props

  const handleAddOne = () => {
    onChange(value + 1, ticketTier)
  }

  const handleSubtractOne = () => {
    if (value > 0) {
      onChange(value - 1, ticketTier)
    }
  }

  return (
    <>
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
        <div className='text-center fs-base-n2 mt-5'>
          <strong>Price &times; {value}</strong> &mdash; ${ticketTier[paymentType]?.price * value}
        </div>
      </div>
    </>
  )
}

export default TicketCounter

TicketCounter.propTypes = {
  value: propTypes.number,
  ticketTier: propTypes.object,
  paymentType: propTypes.string,
  onChange: propTypes.func,
}
