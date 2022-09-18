import propTypes from 'prop-types'

export function EventContainer(props) {
  const { event } = props

  return (
    <div className='container p-10 d-flex flex-column align-items-center'>
      <div className='landing-page-event-title'>{event.title}</div>
      <div className='landing-page-card background-image'>
        <div className='landing-page-card-text-1'>Total Attendance:</div>
        <div className='landing-page-card-text-2 mb-15'>{event.capacity}</div>
        <div className='landing-page-card-text-1'>Date:</div>
        <div className='landing-page-card-text-2 mb-15'>{event.start_date}</div>
        <div className='landing-page-card-text-1'>Venue:</div>
        <div className='landing-page-card-text-2'>{event.localized_address_display}</div>
      </div>
    </div>
  )
}

EventContainer.propTypes = {
  event: propTypes.object,
}
