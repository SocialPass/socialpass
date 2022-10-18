import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

import { EventApi } from '@/services/api'

import TicketSelector from '@/components/TicketSelector'
import './index.css'

export default function Home() {
  const navigate = useNavigate()
  const { event }: any = useEvent()
  const { saveCheckout, setCheckout, checkout, setCheckoutItems, checkoutItems }: any =
    useCheckout()

  const [paymentType, setPaymentType] = useState('')
  const [ticketTiers, setTicketTiers] = useState<any[]>([])
  const [email, setEmail] = useState('')

  const getTicketTiers = (eventPublicId: string) => {
    EventApi.getTicketTiers(eventPublicId).then((res) => {
      setTicketTiers(res.data)
    })
  }

  const getFiatTicketTiers = () =>
    ticketTiers.filter((ticket) => 'tier_fiat' in ticket && ticket.tier_fiat)

  const getCryptocurrencyTicketTiers = () =>
    ticketTiers.filter((ticket) => 'tier_cryptocurrency' in ticket && ticket.tier_cryptocurrency)

  const getAssetOwnershipTicketTiers = () =>
    ticketTiers.filter((ticket) => 'tier_asset_ownership' in ticket && ticket.tier_asset_ownership)

  const getPaymentTypeTicketTiers = () => {
    if (paymentType == 'tier_fiat') {
      return getFiatTicketTiers()
    }
    if (paymentType == 'tier_cryptocurrency') {
      return getCryptocurrencyTicketTiers()
    }
    if (paymentType == 'tier_asset_ownership') {
      return getAssetOwnershipTicketTiers()
    }
    return []
  }

  const setTicketTierSelectedAmount = (amount, ticketTier) => {
    const new_selected = [...checkoutItems]

    const ticketIndex = new_selected.findIndex(
      (item) => item.ticket_tier.public_id === ticketTier.public_id,
    )

    if (ticketIndex !== -1) {
      if (amount > 0) {
        new_selected[ticketIndex].quantity = amount
      } else {
        new_selected.splice(ticketIndex, 1)
      }
    } else {
      new_selected.push({
        ticket_tier: {
          public_id: ticketTier.public_id,
          ticket_type: ticketTier.ticket_type,
          price: ticketTier[paymentType].price,
        },
        quantity: amount,
      })
    }

    setCheckoutItems(new_selected)
  }

  const getTotalPrice = () =>
    checkoutItems.reduce(
      (acc, ticketTier) => acc + ticketTier?.quantity * ticketTier?.ticket_tier?.price || 0,
      0,
    )

  const getPriceWithCurrencySymbol = (amount) => {
    if (paymentType === 'tier_fiat') {
      return `$${amount}`
    } else if (paymentType === 'tier_cryptocurrency') {
      return `${amount} ETH`
    }

    return 'N/A'
  }

  const validateEmail = () => {
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
  }

  const eventHasTickets = () => ticketTiers.length

  const handleGetTicketsButton = () => {
    setCheckout({
      event_id: event.public_id,
      email,
      cost: getTotalPrice(),
    })

    console.log('result', checkout, checkoutItems)

    // saveCheckout()

    navigate(`checkout/checkoutID`)
  }

  useEffect(() => {
    if (getFiatTicketTiers().length) {
      setPaymentType('tier_fiat')
    } else if (getCryptocurrencyTicketTiers().length) {
      setPaymentType('tier_cryptocurrency')
    } else if (getAssetOwnershipTicketTiers().length) {
      setPaymentType('tier_asset_ownership')
    }
  }, [ticketTiers])

  useEffect(() => {
    getTicketTiers(event.public_id)
  }, [event])

  return (
    <>
      <div className='w-100 hs-200 position-relative'>
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img src={event.cover_image} className='w-100 h-auto' alt='Cover image'></img>
        </div>

        <div className='position-absolute z-1 top-100 start-50 translate-middle px-content'>
          <div className='ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden bg-gray-very-light-lm bg-darkgray-very-dim-dm'>
            <img
              src={event.team.theme.logo}
              className='d-block w-100 h-auto'
              alt='Team image'
            ></img>
          </div>
        </div>
      </div>

      <div className='px-content pt-40 text-center'>
        <p className='text-muted mt-5 mb-0'>Hosted By</p>
        <h6 className='text-strong fs-base fw-700 m-0'>{event.team.name}</h6>
      </div>

      <div className='row'>
        <div className='col-md-7'>
          <div className='content mt-20 mb-0'>
            <h1 className='text-strong fw-700 display-6 m-0'>{event.title}</h1>
            <p className='mt-20 fsr-6'>{event.description}</p>
          </div>
        </div>

        <div className='col-md-5'>
          <div className='content mt-0 mt-md-30 mb-0'>
            <div className='d-flex align-items-center'>
              <div className='ws-25 flex-shrink-0'>
                <i className='fa-regular fa-clock'></i>
              </div>
              <div className='fw-bold'>Date & Time</div>
            </div>
            <p className='text-muted mt-5 mb-0'>{event.start_date}</p>

            <div className='d-flex align-items-center mt-15'>
              <div className='ws-25 flex-shrink-0'>
                <i className='fa-regular fa-location-dot'></i>
              </div>
              <div className='fw-bold'>Location</div>
            </div>
            <p className='text-muted mt-5 mb-0'>{event.localized_address_display}</p>
          </div>
        </div>
        <div className='col-12'>
          <div className='content mt-20 mb-0'>
            {eventHasTickets() ? (
              <>
                <div>
                  <div
                    className='alert alert-primary m-0 text-primary-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
                    role='alert'
                  >
                    <i className='fa-regular fa-check me-15'></i>
                    <p className='m-0'>
                      Tickets available! Please select the payment type and tickets you want to
                      purchase.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div
                    className='alert alert-danger m-0 text-danger-dim-lm px-20 py-10 fw-bold rounded-2 d-flex align-items-center'
                    role='alert'
                  >
                    <i className='fa-regular fa-times me-15'></i>
                    <p className='m-0'>Sorry! Tickets are not available for this event.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {eventHasTickets() ? (
        <>
          <div className='content mb-0'>
            <div className='ticket-tier-group'>
              <div
                className={'ticket-tier'}
                onClick={() => {
                  if (getFiatTicketTiers().length) {
                    setPaymentType('tier_fiat')
                    setCheckoutItems([])
                  }
                }}
              >
                <input
                  type='radio'
                  className='ticket-tier-input'
                  disabled={!getFiatTicketTiers().length}
                  checked={paymentType === 'tier_fiat'}
                />
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
              <div
                className={'ticket-tier'}
                onClick={() => {
                  if (getCryptocurrencyTicketTiers().length) {
                    setPaymentType('tier_cryptocurrency')
                    setCheckoutItems([])
                  }
                }}
              >
                <input
                  type='radio'
                  className='ticket-tier-input'
                  disabled={!getCryptocurrencyTicketTiers().length}
                  checked={paymentType === 'tier_cryptocurrency'}
                />
                <label htmlFor='fiat' className='ticket-tier-label'>
                  <h6 className='fw-700 m-0 fs-base'>
                    <span className='ticket-tier-uncheck'>
                      <i className='fa-light fa-money-check-dollar-pen'></i>
                    </span>
                    <span className='ticket-tier-check'>
                      <i className='fa-light fa-money-check-dollar-pen'></i>
                    </span>
                    Crypto
                  </h6>
                </label>
              </div>
              <div
                className={'ticket-tier'}
                onClick={() => {
                  if (getAssetOwnershipTicketTiers().length) {
                    setPaymentType('tier_asset_ownership')
                    setCheckoutItems([])
                  }
                }}
              >
                <input
                  type='radio'
                  className='ticket-tier-input'
                  disabled={!getAssetOwnershipTicketTiers().length}
                  checked={paymentType === 'tier_asset_ownership'}
                />
                <label htmlFor='fiat' className='ticket-tier-label'>
                  <h6 className='fw-700 m-0 fs-base'>
                    <span className='ticket-tier-uncheck'>
                      <i className='fa-light fa-money-check-dollar-pen'></i>
                    </span>
                    <span className='ticket-tier-check'>
                      <i className='fa-light fa-money-check-dollar-pen'></i>
                    </span>
                    NFTs
                  </h6>
                </label>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-7'>
              <div className='content me-md-0'>
                {getPaymentTypeTicketTiers().map((tier, index) => (
                  <TicketSelector
                    amount={
                      checkoutItems.find((item) => item.ticket_tier.public_id === tier.public_id)
                        ?.quantity || 0
                    }
                    onChange={(amount, ticketTier) =>
                      setTicketTierSelectedAmount(amount, ticketTier)
                    }
                    paymentType={paymentType}
                    ticketTier={tier}
                    key={`ticket-tier-${index}`}
                    isChecked={
                      !!checkoutItems.find((item) => item.ticket_tier.public_id === tier.public_id)
                    }
                  />
                ))}
              </div>
            </div>
            <div className='col-md-5'>
              <div className='px-content pt-md-30 position-md-sticky top-0 start-0'>
                <p className='fs-base-n2 mt-0'>
                  Your ticket(s) will be sent to your email address, so please make sure you enter
                  the correct one!{' '}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                  <button
                    className='btn btn-secondary btn-lg fsr-6 btn-block mt-15'
                    disabled={!validateEmail() || !getTotalPrice()}
                    onClick={(e) => {
                      e.preventDefault()
                      handleGetTicketsButton()
                    }}
                  >
                    <strong className='antialiased'>Get Tickets</strong>
                  </button>
                </form>
                <p>
                  <strong>Total Price</strong> &mdash; {getPriceWithCurrencySymbol(getTotalPrice())}
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
          </div>
        </>
      ) : (
        <>
          <div className='py-20'></div>
        </>
      )}
    </>
  )
}
