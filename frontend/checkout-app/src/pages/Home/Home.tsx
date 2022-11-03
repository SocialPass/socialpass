import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

import { EventApi, CheckoutItemApi } from '@/services/api'

import TicketSelector from '@/components/TicketSelector'
import './index.css'

export default function Home() {
  const navigate = useNavigate()
  const { event }: any = useEvent()
  const { saveCheckout, setCheckout, checkout, setCheckoutItems, checkoutItems, getTxType }: any =
    useCheckout()

  const [ticketTiers, setTicketTiers] = useState<any[]>([])

  const getTicketTiers = (eventPublicId: string) => {
    EventApi.getTicketTiers(eventPublicId)
      .then((res) => {
        setTicketTiers(res.data)
      })
      .catch(() => {})
  }

  const getFiatTicketTiers = () =>
    ticketTiers.filter((ticket) => 'tier_fiat' in ticket && ticket.tier_fiat)

  const getCryptocurrencyTicketTiers = () =>
    ticketTiers.filter((ticket) => 'tier_cryptocurrency' in ticket && ticket.tier_cryptocurrency)

  const getAssetOwnershipTicketTiers = () =>
    ticketTiers.filter((ticket) => 'tier_asset_ownership' in ticket && ticket.tier_asset_ownership)

  const getPaymentTypeTicketTiers = () => {
    if (checkout?.tx_type == 'FIAT') {
      return getFiatTicketTiers()
    }
    if (checkout?.tx_type == 'BLOCKCHAIN') {
      return getCryptocurrencyTicketTiers()
    }
    if (checkout?.tx_type == 'ASSET_OWNERSHIP') {
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
        // Update on context
        new_selected[ticketIndex].quantity = amount

        // Update on backend
        if (checkout.public_id) {
          CheckoutItemApi.edit(new_selected[ticketIndex].public_id, {
            ...new_selected[ticketIndex],
            quantity: amount,
          })
        }
      } else {
        // Delete on backend
        if (checkout.public_id) {
          console.log(new_selected, ticketIndex)
          CheckoutItemApi.delete(new_selected[ticketIndex].public_id)
        }

        // Delete on context
        new_selected.splice(ticketIndex, 1)
      }
    } else {
      // Create on context
      new_selected.push({
        ticket_tier: {
          public_id: ticketTier.public_id,
          ticket_type: ticketTier.ticket_type,
          price: ticketTier[getTxType(checkout?.tx_type)]?.price,
        },
        quantity: amount,
      })

      // Create on backend
      if (checkout.public_id) {
        CheckoutItemApi.create({
          ticket_tier: ticketTier.public_id,
          quantity: amount,
          checkout_session: checkout.public_id,
        }).then((res) => {
          // save the new public_id on the checkout item context
          new_selected[new_selected.length - 1].public_id = res.data.public_id
        })
      }
    }

    setCheckoutItems(new_selected)
  }

  const getTotalPrice = () =>
    checkoutItems.reduce(
      (acc, ticketTier) => acc + ticketTier?.quantity * ticketTier?.ticket_tier?.price || 0,
      0,
    )

  const getPriceWithCurrencySymbol = (amount) => {
    if (checkout?.tx_type === 'FIAT') {
      return `$${amount}`
    } else if (checkout?.tx_type === 'BLOCKCHAIN') {
      return `${amount} ETH`
    }
    // The asset_ownership modality does not have currency
    return 'N/A'
  }

  const validateEmail = () => {
    // Checks for '@', whitespaces and TLD existence
    const regex = /\S+@\S+\.\S+/
    return regex.test(checkout?.email)
  }

  const validateName = () => checkout?.name?.length > 0

  const eventHasTickets = () => ticketTiers.length

  const handleGetTicketsButton = () => {
    saveCheckout().then((res) => {
      navigate(`checkout/${res.public_id}`)
    })
  }

  const isNewCheckout = () => !checkout?.public_id

  useEffect(() => {
    if (!checkout?.public_id) {
      if (getFiatTicketTiers().length) {
        setCheckout({ ...checkout, tx_type: 'FIAT' })
      } else if (getCryptocurrencyTicketTiers().length) {
        setCheckout({ ...checkout, tx_type: 'BLOCKCHAIN' })
      } else if (getAssetOwnershipTicketTiers().length) {
        setCheckout({ ...checkout, tx_type: 'ASSET_OWNERSHIP' })
      }
    }
  }, [ticketTiers])

  useEffect(() => {
    getTicketTiers(event?.public_id)
    setCheckout({ ...checkout, event: event?.public_id })
  }, [event])

  return (
    <>
      <div className='w-100 hs-200 position-relative'>
        <div className='d-flex align-items-center justify-content-center w-100 h-100 bg-gray-very-light-lm bg-darkgray-very-dim-dm overflow-hidden pe-none'>
          <img src={event?.cover_image} className='w-100 h-auto' alt='Cover image'></img>
        </div>

        <div className='position-absolute z-1 top-100 start-50 translate-middle px-content'>
          <div className='ws-75 hs-75 rounded-circle border border-5 border-blend d-flex align-items-center justify-content-center overflow-hidden bg-gray-very-light-lm bg-darkgray-very-dim-dm'>
            <img src={event?.team.image} className='d-block w-100 h-auto' alt='Team image'></img>
          </div>
        </div>
      </div>

      <div className='px-content pt-40 text-center'>
        <p className='text-muted mt-5 mb-0'>Hosted By</p>
        <h6 className='text-strong fs-base fw-700 m-0'>{event?.team.name}</h6>
      </div>

      <div className='row'>
        <div className='col-md-7'>
          <div className='content mt-20 mb-0'>
            <h1 className='text-strong fw-700 display-6 m-0 text-break'>{event?.title}</h1>
            <p className='mt-20 fsr-6 text-break'>{event?.description}</p>
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
            <p className='text-muted mt-5 mb-0'>{event?.start_date}</p>

            <div className='d-flex align-items-center mt-15'>
              <div className='ws-25 flex-shrink-0'>
                <i className='fa-regular fa-location-dot'></i>
              </div>
              <div className='fw-bold'>Location</div>
            </div>
            <p className='text-muted mt-5 mb-0'>{event?.localized_address_display}</p>
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
                    <p className='m-0'>Sorry! Tickets are not available for this event?.</p>
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
                  if (getFiatTicketTiers().length && isNewCheckout()) {
                    setCheckout({ ...checkout, tx_type: 'FIAT' })
                    setCheckoutItems([])
                  }
                }}
              >
                <input
                  type='radio'
                  className='ticket-tier-input'
                  disabled={!getFiatTicketTiers().length || !isNewCheckout()}
                  checked={checkout?.tx_type === 'FIAT'}
                  readOnly
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
                  if (getCryptocurrencyTicketTiers().length && isNewCheckout()) {
                    setCheckout({ ...checkout, tx_type: 'BLOCKCHAIN' })
                    setCheckoutItems([])
                  }
                }}
              >
                <input
                  type='radio'
                  className='ticket-tier-input'
                  disabled={!getCryptocurrencyTicketTiers().length || !isNewCheckout()}
                  checked={checkout?.tx_type === 'BLOCKCHAIN'}
                  readOnly
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
                  if (getAssetOwnershipTicketTiers().length && isNewCheckout()) {
                    setCheckout({ ...checkout, tx_type: 'ASSET_OWNERSHIP' })
                    setCheckoutItems([])
                  }
                }}
              >
                <input
                  type='radio'
                  className='ticket-tier-input'
                  disabled={!getAssetOwnershipTicketTiers().length || !isNewCheckout()}
                  checked={checkout?.tx_type === 'ASSET_OWNERSHIP'}
                  readOnly
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
                    paymentType={checkout?.tx_type}
                    ticketTier={tier}
                    key={`ticket-tier-${index}`}
                    // below !! operator converts Object to boolean
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
                  {/* <a href='#' className='fw-bold' target='_blank'>
                    Learn more <i className='fa-regular fa-external-link'></i>
                  </a> */}
                </p>
                <form>
                  <input
                    type='text'
                    name='name'
                    className='form-control mb-10'
                    placeholder='Name'
                    value={checkout?.name}
                    onChange={(e) => setCheckout({ ...checkout, name: e.target.value })}
                  ></input>
                  <input
                    type='text'
                    name='email'
                    className='form-control'
                    placeholder='Email Address'
                    value={checkout?.email}
                    onChange={(e) => setCheckout({ ...checkout, email: e.target.value })}
                  ></input>
                  <button
                    className='btn btn-secondary btn-lg fsr-6 btn-block mt-15'
                    // Get Tickets button is only enabled by having tickets selected and a valid e-mail input
                    disabled={!validateName() || !validateEmail() || !checkoutItems.length}
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
                  <a
                    href='https://drive.google.com/file/d/1mulvB8lIEl3AZghIBqlISBI-jdNk25W5/view'
                    className='fw-bold'
                    target='_blank'
                    rel='noreferrer'
                  >
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
