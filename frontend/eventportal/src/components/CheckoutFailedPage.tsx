import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckoutPortalContext } from '../context'

export default function CheckoutFailedPage() {
  const { id, retrieveJson } = useContext(CheckoutPortalContext)
  const navigate = useNavigate()

  return (
    <div className='row'>
      {/* <!-- Status information start --> */}
      <div className='col-md-7'>
        <div className='content'>
          <h1 className='text-strong fw-700 fsr-4 mt-0 mb-0'>Something went wrong</h1>
          <p className='mt-10'>
            We're sorry, but we're unable to issue tickets for this event right now.
          </p>
          <div
            className='alert alert-danger d-inline-block text-danger-dim-lm px-10 py-5 fw-bold rounded-3'
            role='alert'
          >
            <i className='fa-regular fa-times me-5'></i> Access Denied
          </div>
          <div className='d-flex align-items-center'>
            <div className='ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0'>
              <img
                src={retrieveJson.team.image}
                className='d-block w-100 h-auto'
                alt='Team image'
              />
            </div>
            <div className='px-content ps-20'>
              <p className='text-muted m-0 text-truncate'>By {retrieveJson?.team.name}</p>
              <h2 className='text-strong fs-base-p2 fw-700 m-0 text-truncate'>
                {retrieveJson?.title}
              </h2>
            </div>
          </div>
          <div className='text-muted d-flex align-items-center mt-10'>
            <div className='ws-25 flex-shrink-0'>
              <i className='fa-regular fa-clock'></i>
            </div>
            <div className='text-truncate'>{retrieveJson.start_date}</div>
          </div>
          <div className='text-muted d-flex align-items-center mt-5'>
            <div className='ws-25 flex-shrink-0'>
              <i className='fa-regular fa-location-dot'></i>
            </div>
            <div className='text-truncate'>{retrieveJson?.location}</div>
          </div>
        </div>
      </div>
      {/* <!-- Status information end --> */}

      {/* <!-- CTA section start --> */}
      <div className='col-md-5'>
        <div className='p-content position-md-sticky top-0 start-0'>
          <h6 className='text-strong fw-700 fsr-6 mt-0 mb-0'>Get Ticket</h6>
          <p className='mt-10'>Something went wrong trying to generate your tickets.</p>
          <button
            onClick={() => {
              navigate(`/${id}`)
            }}
            className='btn btn-secondary btn-lg fsr-6 btn-block'
          >
            <strong className='antialiased'>Try again</strong>
          </button>
        </div>
      </div>
      {/* <!-- CTA section end --> */}
    </div>
  )
}
