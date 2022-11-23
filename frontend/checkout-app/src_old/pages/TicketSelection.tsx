import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckoutPortalContext } from '../context'
import GeneralAdmissionFAQHoverIcon from '../components/GeneralAdmissionFAQ'

export function TicketSelection() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.publicId
  const { retrieveJson, generalAdmissionSelect, setGeneralAdmissionSelect } =
    useContext(CheckoutPortalContext)
  // [1 ... generalAdmissionSelectArray]
  const generalAdmissionSelectArray = Array.from(
    { length: generalAdmissionSelect },
    (_, i) => i + 1,
  )

  const [matches, setMatches] = useState(window.matchMedia('(min-width: 768px)').matches)

  useEffect(() => {
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => setMatches(e.matches))
  }, [])

  function handleSelect(event: any) {
    setGeneralAdmissionSelect(event.target.value)
  }
  return (
    <div className='responsive-page-selection'>
      <div>
        <div className='d-flex flex-column align-items-start justify-content-between mb-30 gap-5'>
          <span className='fs-20 fw-700'>Ticket Selection</span>
          <span className='text-muted'>Select your tickets from the options below</span>
        </div>
        <div className='responsive-ticket-selection'>
          <div>
            <div className='d-flex flex-row align-items-center me-12'>
              <span className='fs-18 fw-bold me-15'>General Admission</span>

              <div className='tooltip'>
                <GeneralAdmissionFAQHoverIcon locationClass='bottom'></GeneralAdmissionFAQHoverIcon>
              </div>
            </div>
            <div className='d-inline fw-bold'>free</div>
            <br />
            <p>Limit {retrieveJson.limit_per_person} Per Person</p>
          </div>
          <div className='d-inline'>
            <select
              defaultValue={generalAdmissionSelect}
              onChange={handleSelect}
              className='ticket-select btn-primary px-10 ms-30'
            >
              {generalAdmissionSelectArray.map(function (object) {
                return (
                  <option key={object} className='bg-white text-color-primary' value={1}>
                    {object}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <hr className='border-top' />
      </div>
      <div className='bg-gray'>
        {/* If on desktop mode, append bg-gray-extend to document */}
        {matches === true ? <div className='bg-gray-extend'></div> : null}
        <div className='d-flex flex-column justify-start-center'>
          <div className='d-flex flex-column align-items-start justify-start-center p-30'>
            <h3 className='fs-20'>Summary</h3>
            <div className='d-flex flex-row'>
              <p>{generalAdmissionSelect} X General Admission Ticket</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center p-30 mt-50'>
            <button
              onClick={() => {
                navigate(`/${id}/checkout/blockchain`)
              }}
              className='btn btn-primary fs-20 text-capitalize rounded-3'
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}