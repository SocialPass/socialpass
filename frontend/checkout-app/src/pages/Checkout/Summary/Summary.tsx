import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useNavigate } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

export default function Summary(props) {
  const { onContinueClick, enableContinue, isCheckoutProcessing } = props

  const navigate = useNavigate()

  const { event }: any = useEvent()
  const { checkout, checkoutItems, getTxType }: any = useCheckout()

  const [name, setName] = useState<string>(checkout?.name)
  const [email, setEmail] = useState<string>(checkout?.email)

  const handleEditClick = () => {
    navigate(`/${event.public_id}`)
  }

  const getTotalPrice = () => {
    return checkoutItems.reduce((acc, item) => {
      return acc + item.ticket_tier[getTxType(checkout?.tx_type)]?.price * item.quantity
    }, 0)
  }

  const getPriceWithCurrencySymbol = (value) => {
    if (checkout?.tx_type === 'FIAT') {
      return `$${value}`
    } else if (checkout?.tx_type === 'BLOCKCHAIN') {
      return `${value} ETH`
    }

    return 'N/A'
  }

  const isButtonDisable = (!isCheckoutProcessing && enableContinue) ? false : true 

  useEffect(() => {
    setName(checkout?.name)
    setEmail(checkout?.email)
  }, [])

  return (
    <div className='px-content pt-md-20 position-md-sticky top-0 start-0'>
      <div className='d-flex align-items-center mb-10'>
        <h6 className='fw-700 fsr-6 m-0'>Summary</h6>

        <div className='text-secondary ms-auto'>
          <a href='#' className='link-reset fw-bold' onClick={() => handleEditClick()}>
            Edit
          </a>
        </div>
      </div>

      {checkoutItems.map((item: any) => (
        <div className='py-10 border-top' key={`checkout-item-${item.public_id}`}>
          <h6 className='fw-700 m-0 fs-base d-flex align-items-center'>
            <span>{item.ticket_tier.ticket_type}</span>
            <span className='ms-auto ps-10 fw-normal'>&times; {item.quantity}</span>
          </h6>
          {checkout?.tx_type !== 'ASSET_OWNERSHIP' ? (
            <div className='fs-base-n2 mt-5'>
              <strong>Price</strong> &mdash;{' '}
              {getPriceWithCurrencySymbol(item.ticket_tier[getTxType(checkout?.tx_type)]?.price)}
            </div>
          ) : null}
        </div>
      ))}

      <form className='mt-20'>
        <input
          type='text'
          name='name'
          className='form-control mb-10'
          placeholder='Name'
          value={name}
          readOnly
        ></input>
        <input
          type='text'
          name='email'
          className='form-control'
          placeholder='Email Address'
          value={email}
          readOnly
        />
        <button
          className='btn btn-secondary btn-lg fsr-6 btn-block mt-15'
          onClick={(e) => {
            onContinueClick(e)
          }}
          disabled={isButtonDisable}
        >
          {isCheckoutProcessing &&
            <span className="spinner-border spinner-border-sm me-5" role="status" aria-hidden="true"></span>
          }
          <strong className='antialiased'>Continue</strong>
        </button>
      </form>
      {checkout?.tx_type !== 'ASSET_OWNERSHIP' ? (
        <p>
          <strong>Total Price</strong> &mdash; {getPriceWithCurrencySymbol(getTotalPrice())}
        </p>
      ) : null}
      <hr />
      <p className='text-muted fs-base-n2'>
        If you need help placing your order, please{' '}
        <a
          href='https://nfty-ecosystem.typeform.com/socialpass-help'
          className='fw-bold'
          rel='noreferrer'
          target='_blank'
        >
          contact us <i className='fa-regular fa-external-link'></i>
        </a>{' '}
        and let us know
      </p>
    </div>
  )
}

Summary.propTypes = {
  onContinueClick: PropTypes.func.isRequired,
  enableContinue: PropTypes.bool.isRequired,
  isCheckoutProcessing: PropTypes.bool.isRequired
}