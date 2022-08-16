import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckoutPortalContext } from '../context'

export const Event = (): JSX.Element => {
  const navigate = useNavigate()
  const { id, retrieveJson, generalAdmissionSelect, setGeneralAdmissionSelect } =
    useContext(CheckoutPortalContext)

  console.log(retrieveJson)

  const generalAdmissionSelectArray = Array.from(
    { length: generalAdmissionSelect },
    (_, i) => i + 1,
  )

  function handleNavigate() {
    navigate(`/${id}/checkout/blockchain`)
  }

  function handleSelect(event: any) {
    setGeneralAdmissionSelect(event.target.value)
  }

  return (
    <div className='row'>
      <div className='col-md-7'>
        <div className='content'>
          <h1 className='text-strong fw-700 fsr-1 mt-0 mb-0'>{retrieveJson.title}</h1>
          <p className='mt-20'>{retrieveJson.description}</p>
          <div className='text-muted d-flex align-items-center mt-20'>
            <div className='ws-25 flex-shrink-0'>
              <i className='fa-regular fa-clock'></i>
            </div>
            <div className='text-truncate'>{retrieveJson.start_date}</div>
          </div>
          <div className='text-muted d-flex align-items-center mt-5'>
            <div className='ws-25 flex-shrink-0'>
              <i className='fa-regular fa-location-dot'></i>
            </div>
            <div className='text-truncate'>{retrieveJson.location}</div>
          </div>
          {retrieveJson.show_ticket_count && (
            <div
              className='alert alert-success mt-30 text-success-dim-lm px-20 py-10 fw-bold rounded-3'
              role='alert'
            >
              <strong className='fw-700'>
                {(retrieveJson.capacity - retrieveJson.ticket_count)
                  .toFixed(0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </strong>{' '}
              out of{' '}
              {retrieveJson.capacity
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              available
            </div>
          )}
        </div>
      </div>

      <div className='col-md-5'>
        <div className='p-content position-md-sticky top-0 start-0'>
          <div className='d-flex align-items-center'>
            <h6 className='text-strong fw-700 fsr-6 mt-0 mb-0'>General Admission</h6>

            <div className='dropup toggle-on-hover ms-auto'>
              <a
                href='#'
                className='text-secondary text-decoration-none'
                data-hm-toggle='dropdown'
                id='general-admission-toggle'
                aria-expanded='false'
              >
                <i className='fa-regular fa-info-circle'></i>
                <span className='visually-hidden'>Information</span>
              </a>
              <div
                className='dropdown-menu dropdown-menu-end p-10 ws-250 rounded-2'
                aria-labelledby='general-admission-toggle'
              >
                <div>
                  This General Admission ticket is free to all holders of 1 NFT of collection:
                </div>
                {retrieveJson.requirements.map((requirement, index) => (
                  <div key={index}>
                    <div className='mt-10'>
                      <strong>Contract {index + 1}</strong>
                    </div>
                    <div className='text-truncate'>
                      <span className='text-secondary'>
                        <a href='#' className='fw-bold link-reset'>
                          {requirement['asset_address']}
                        </a>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className='text-muted mt-20'>Sale ends on May 31, 2022</p>
          <div className='form-group'>
            <select onChange={handleSelect} className='form-select'>
              {generalAdmissionSelectArray.map(function (object) {
                return (
                  <option key={object} value={object}>
                    {object}
                  </option>
                )
              })}
            </select>
          </div>
          <button className='btn btn-secondary btn-lg fsr-6 btn-block' onClick={handleNavigate}>
            <strong className='antialiased'>Get Tickets &times; {generalAdmissionSelect}</strong>
          </button>
          <p>
            {generalAdmissionSelect} &times; General Admission Ticket
            <br />
            <strong>Price &mdash; </strong> Free
          </p>
        </div>
      </div>
    </div>
  )
}
