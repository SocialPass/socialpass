import { HashLoader } from 'react-spinners'

const EventLoading = () => {
  return (
    <div className='error-footer'>
      <div className='error-padding'></div>
      <div className='d-flex flex-column align-items-center justify-content-center'>
        <div className='mb-50'>
          <HashLoader color='#EF7C4E' size={120} />
        </div>
        <div className='fs-16 fw-500 mt-50'>Loading event, please wait a second...</div>
      </div>
    </div>
  )
}

export default EventLoading
