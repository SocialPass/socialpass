import propTypes from 'prop-types'

const EventContainer = (props) => {
  const { event } = props

  return (
    <div className='mt-auto'>
      <div className='card text-base rounded-4 shadow-lg border-transparent fs-base-p2'>
        <h1 className='fw-700 text-center fs-base-p10 mt-0'>{event?.title}</h1>
        <div className='fw-700 text-primary mt-30'>
          <i className='fa-regular fa-user me-5'></i> Total Attendance:
        </div>
        <div>{event?.capacity}</div>
        <div className='fw-700 text-primary mt-15'>
          <i className='fa-regular fa-clock me-5'></i> Date:
        </div>
        <div>{event?.start_date}</div>
        <div className='fw-700 text-primary mt-15'>
          <i className='fa-regular fa-location-dot me-5'></i> Venue:
        </div>
        <div>{event?.localized_address_display}</div>
      </div>
    </div>
  )
}

export default EventContainer

EventContainer.propTypes = {
  event: propTypes.object,
}
