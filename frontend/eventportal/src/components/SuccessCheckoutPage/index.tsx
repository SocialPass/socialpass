import { useContext, useState } from 'react'
import { CheckoutPortalContext } from '../../context'
import styles from './styles.module.css'

import CardInfoEvent from '../../components/CardInfoEvent'
import TicketEvent from '../../components/TicketEvent'

export function SuccessCheckoutPage() {
  const { grantAccessJson } = useContext(CheckoutPortalContext)
  const [email, setEmail] = useState('')

  const validateEmail = (email) => {
    return email.match(
      // eslint-disable-next-line
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (validateEmail(email)) {
      // logic to sent email here
    }
  }

  return (
    <div className='row'>
      {/* <!-- congrats --> */}
      <div className='d-flex flex-column align-items-center justify-content-center'>
        <h2 className='title-break-text'>Congratulations!</h2>
        <span className='text-center fs-18'>
          We’ve verified your NFT ownership and generated your ticket{' '}
        </span>
      </div>
      {/* <!--end congrats --> */}
      {/* <!--CTA section --> */}
      <div className='d-flex flex-row align-items-start justify-content-center flex-wrap'>
        {/* ticket */}
        <div className='col-md-5'>
          <div className='content'>
            <TicketEvent />
          </div>
        </div>
        {/* end ticket */}
        {/* card info */}
        <div className='col-md-7'>
          <div className='content'>
            <CardInfoEvent />
          </div>
        </div>
        {/* end card info */}
        <div className='d-flex w-100 flex-row align-items-end justify-content-center flex-wrap'>
          <div className='col-md-5'>
            <div className='mx-40 mb-50'>
              <button
                onClick={() => window.open(grantAccessJson[0]['download_url'])}
                className='btn w-100 rounded-3 border-3 border-secondary bg-transparent text-secondary fw-bold fs-18'
              >
                Download Ticket
              </button>
            </div>
          </div>
          <div className='col-md-7'>
            <div className='mx-40 mb-50'>
              <label htmlFor='user-email' className='fw-bold'>
                Want us to email your ticket?{' '}
              </label>
              <form onSubmit={handleSubmit} className='d-flex align-items-center gap-10'>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className={`rounded-3 py-5 w-100 ${styles.input_boder}`}
                  type='email'
                  name='user-email'
                  id='user-email'
                />
                <button
                  type='submit'
                  className={`btn btn-secondary rounded-3 px-15 ${styles.letter_spacing_button}`}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!--end CTA section --> */}
    </div>
  )
}
