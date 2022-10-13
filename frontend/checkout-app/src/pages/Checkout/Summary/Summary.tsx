import { useNavigate } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import useCheckout from '@/hooks/useCheckout'

export default function Summary() {
  const navigate = useNavigate()

  const { event }: any = useEvent()
  const { checkout, checkoutItems }: any = useCheckout()

  const handleEditClick = () => {
    navigate(`/${event.public_id}`)
  }

  const getPriceWithCurrencySymbol = (value) => {
    if (checkout?.tx_type === 'tier_fiat') {
      return `$${value}`
    } else if (checkout?.tx_type === 'tier_cryptocurrency') {
      return `${value} ETH`
    }

    return 'N/A'
  }

  return (
    <>
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
          <div className='fs-base-n2 mt-5'>
            <strong>Price</strong> &mdash;{' '}
            {getPriceWithCurrencySymbol(item.ticket_tier[checkout.tx_type].price)}
          </div>
        </div>
      ))}
    </>
  )
}
