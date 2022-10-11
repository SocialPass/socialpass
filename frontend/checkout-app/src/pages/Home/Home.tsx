import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'

import { EventApi } from '@/services/api'

import './index.css'

export default function Home() {
  const navigate = useNavigate()
  const [ticketTiers, setTicketTiers] = useState<any[]>([])
  const [ticketAmount, setTicketAmount] = useState(0)

  const { event }: any = useEvent()

  const getTicketTiers = (eventPublicId: string) => {
    EventApi.getTicketTiers(eventPublicId).then((res) => {
      setTicketTiers(res.data)
    })
  }

  // const generalAdmissionSelectArray = Array.from(
  //   { length: generalAdmissionSelect },
  //   (_, i) => i + 1,
  // )

  // function handleNavigate() {
  //   navigate(`/${id}/checkout/blockchain`)
  // }

  // function handleSelect(event: any) {
  //   setGeneralAdmissionSelect(event.target.value)
  // }

  // var ticketAmount = 0

  useEffect(() => {
    getTicketTiers(event.public_id)
  }, [event])

  return (
    <>
      {/* <!-- Header start --> */}
      <div className='w-100 hs-200 position-relative'>
        {/* <!-- Event cover image start --> */}
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img
            src='https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            className='w-100 h-auto'
            alt='Cover image'
          ></img>
        </div>
        {/* <!-- Event cover image end --> */}

        {/* <!-- Team image start --> */}
        <div className='position-absolute z-1 top-100 start-50 translate-middle px-content'>
          <div className='ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden'>
            <img
              src='https://www.gitbook.com/cdn-cgi/image/width=100,height=100,fit=contain,dpr=1,format=auto/https%3A%2F%2F2919503366-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FoAjCVAKyaqd3D8vQvqdq%252Ficon%252FSxoMd2us80sdMcUcQ36e%252FSocialPass%2520Logo.jpeg%3Falt%3Dmedia%26token%3D0e6830d3-362b-4383-b36b-ea0ddb6195be'
              className='d-block w-100 h-auto'
              alt='Team image'
            ></img>
          </div>
        </div>
        {/* <!-- Team image end --> */}
      </div>
      {/* <!-- Header end --> */}

      {/* <!-- Team name start --> */}
      <div className='px-content pt-40 text-center'>
        <p className='text-muted mt-5 mb-0'>Hosted By</p>
        <h6 className='text-strong fs-base fw-700 m-0'>{event.team.name}</h6>
      </div>
      {/* <!-- Team name end --> */}

      {/* <!-- Event content start --> */}
      <div className='row'>
        {/* <!-- Hero section start --> */}
        <div className='col-md-7'>
          <div className='content mt-20 mb-0'>
            <h1 className='text-strong fw-700 display-6 m-0'>{event.title}</h1>
            <p className='mt-20 fsr-6'>{event.description}</p>
          </div>
        </div>
        {/* <!-- Hero section end --> */}

        {/* <!-- Event details start --> */}
        <div className='col-md-5'>
          <div className='content mt-0 mt-md-30 mb-0'>
            {/* <!-- Event date & time start --> */}
            <div className='d-flex align-items-center'>
              <div className='ws-25 flex-shrink-0'>
                <i className='fa-regular fa-clock'></i>
              </div>
              <div className='fw-bold'>Date & Time</div>
            </div>
            <p className='text-muted mt-5 mb-0'>{event.start_date}</p>
            {/* <!-- Event date & time end --> */}

            {/* <!-- Event location start --> */}
            <div className='d-flex align-items-center mt-15'>
              <div className='ws-25 flex-shrink-0'>
                <i className='fa-regular fa-location-dot'></i>
              </div>
              <div className='fw-bold'>Location</div>
            </div>
            <p className='text-muted mt-5 mb-0'>{event.localized_address_display}</p>
            {/* <!-- Event location end --> */}
          </div>
        </div>
        {/* <!-- Event details end --> */}

        {/* <!-- Ticket status start --> */}
        <div className='col-12'>
          <div className='content mt-20 mb-0'>
            {/* <!-- { if tickets are available } --> */}
            <div
              className='alert alert-primary m-0 text-primary-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
              role='alert'
            >
              <i className='fa-regular fa-check me-15'></i>
              <p className='m-0'>
                Tickets available! Please select the payment type and tickets you want to purchase.
              </p>
            </div>
            {/* <!-- { else show the following } --> */}

            {/* <div className="alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center" role="alert">
										<i className="fa-regular fa-times me-15"></i>
										<p className="m-0">
											Sorry! Tickets are not available for this event.
										</p>
									</div> */}
          </div>
        </div>
        {/* <!-- Ticket status end --> */}
      </div>
      {/* <!-- Event content end --> */}

      {/* <!-- Ticket tier payment types start --> */}
      <div className='content mb-0'>
        <div className='ticket-tier-group'>
          {/* <!-- Fiat start --> */}
          <div className='ticket-tier'>
            <input
              type='radio'
              className='ticket-tier-input'
              name='payment-type'
              id='fiat'
              checked
            ></input>
            <label htmlFor='fiat' className='ticket-tier-label'>
              <h6 className='fw-700 m-0 fs-base'>
                <span className='ticket-tier-uncheck'>
                  <i className='fa-light fa-money-check-dollar-pen'></i>
                </span>
                <span className='ticket-tier-check'>
                  <i className='fa-light fa-money-check-dollar-pen'></i>
                </span>
                Fiat
              </h6>
            </label>
          </div>
          {/* <!-- Fiat end --> */}

          {/* <!-- Crypto start --> */}
          <div className='ticket-tier'>
            <input
              type='radio'
              className='ticket-tier-input'
              name='payment-type'
              id='crypto'
            ></input>
            <label htmlFor='crypto' className='ticket-tier-label'>
              <h6 className='fw-700 m-0 fs-base'>
                <span className='ticket-tier-uncheck'>
                  <i className='fa-light fa-wallet'></i>
                </span>
                <span className='ticket-tier-check'>
                  <i className='fa-light fa-wallet'></i>
                </span>
                Crypto
              </h6>
            </label>
          </div>
          {/* <!-- Crypto end --> */}

          {/* <!-- NFTs start --> */}
          <div className='ticket-tier'>
            <input type='radio' className='ticket-tier-input' name='payment-type' id='nfts'></input>
            <label htmlFor='nfts' className='ticket-tier-label'>
              <h6 className='fw-700 m-0 fs-base'>
                <span className='ticket-tier-uncheck'>
                  <i className='fa-light fa-hexagon-image'></i>
                </span>
                <span className='ticket-tier-check'>
                  <i className='fa-light fa-hexagon-image'></i>
                </span>
                NFTs
              </h6>
            </label>
          </div>
          {/* <!-- NFTs end --> */}
        </div>
      </div>
      {/* <!-- Ticket tier payment types end --> */}

      {/* <!-- Ticket tiers and CTA start --> */}
      <div className='row'>
        {/* <!-- Ticket tiers start --> */}
        <div className='col-md-7'>
          <div className='content me-md-0'>
            {/* <!-- Ticket tier start --> */}

            {ticketTiers.map((tier, index) => (
              <div className='ticket-tier mb-20' key={`ticket-tier-index-${index}`}>
                <input type='checkbox' className='ticket-tier-input' id='c1' checked></input>
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
                        {tier.ticket_type}
                      </h6>
                      <p className='m-0 fs-base-n2'>{tier.capacity} available</p>
                    </div>
                    <div className='ticket-tier-controls ms-auto mt-10 mt-sm-0'>
                      <div className='input-group input-group-sm input-group-pill ws-100 mx-auto'>
                        <button
                          className='btn ws-25 px-0'
                          onClick={() => {
														setTicketAmount(ticketAmount - 1);
                          }}
                        >
                          -
                        </button>
                        <input
                          type='number'
                          min='1'
                          max='10'
                          step='1'
                          className='form-control form-number text-center'
													value={ticketAmount}
                        ></input>
                        <button
                          className='btn ws-25 px-0'
                          onClick={() => {
														setTicketAmount(ticketAmount + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div className='text-center fs-base-n2 mt-5'>
                        <strong>Price &times; 1</strong>
                        &mdash; $ {tier.price}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
            {/* <!-- Ticket tier end --> */}
          </div>
          {/* <!-- Ticket tiers end --> */}
        </div>

        {/* <!-- CTA section start --> */}
        <div className='col-md-5'>
          <div className='px-content pt-md-30 position-md-sticky top-0 start-0'>
            <p className='fs-base-n2 mt-0'>
              Your ticket(s) will be sent to your email address, so please make sure you enter the
              correct one!{' '}
              <a href='#' className='fw-bold' target='_blank'>
                Learn more <i className='fa-regular fa-external-link'></i>
              </a>
            </p>
            <form>
              <input
                type='text'
                name='email'
                className='form-control'
                placeholder='Email Address'
              ></input>
              <button className='btn btn-secondary btn-lg fsr-6 btn-block mt-15' type='submit'>
                <strong className='antialiased'>Get Tickets</strong>
              </button>
            </form>
            <p>
              <strong>Total Price</strong>
              &mdash; $9.99
            </p>
            <hr />
            <p className='text-muted fs-base-n4'>
              You're also agreeing to our{' '}
              <a href='#' className='fw-bold' target='_blank'>
                Terms & Conditions <i className='fa-regular fa-external-link'></i>
              </a>{' '}
              by clicking on the above button.
            </p>
          </div>
        </div>
        {/* <!-- CTA section end --> */}
      </div>
      {/* <!-- Ticket tiers and CTA end --> */}
    </>
  )
}
