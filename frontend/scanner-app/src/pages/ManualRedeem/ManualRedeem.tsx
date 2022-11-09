import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import useEvent from '@/hooks/useEvent'

import Button from '@/components/Button'

import { TicketApi } from '@/services/api'

const ManualRedeem = () => {
  const navigate = useNavigate()
  const { redemptionPublicId } = useParams()
  const { event, getEvent, setEvent }: any = useEvent()

  const [code, setCode] = useState<string>('')

  function handleGoBack() {
    getEvent(redemptionPublicId)
    navigate(`/${redemptionPublicId}/scanner`)
  }

  function handleRedeemCode() {
    TicketApi.claim(redemptionPublicId, code)
      .then((data) => {
        setEvent({
          ...event,
          ticket_count: data.ticket_count,
          redeemed_count: data.redeemed_count,
        })

        setCode('')

        toast.success(`Succesful Scan, Tier: ${data.ticket_tier.ticket_type}`)
      })
      .catch((err) => {
        if (err.message === 'Ticket has already been redeemed.')  {
          toast('Succesful Scan: Ticket has already been redeemed', {
          icon: '⚠️',
          });
        }
        else  {
          toast.error(`Scan Failed: ${err.message}`)
        }
      })
  }

  return (
    <div className='content'>
      <button
        type='button'
        className='btn btn-square btn-rounded border-transparent shadow mb-50'
        onClick={() => handleGoBack()}
      >
        <i className='fa-solid fa-arrow-left'></i>
        <span className='visually-hidden'>Go Back</span>
      </button>

      <label>
        <input
          type='text'
          name='ticket_code_input'
          className='form-control mt-5'
          placeholder='Insert ticket code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>

      <Button className='mt-20' disabled={code === ''} onClick={handleRedeemCode}>
        <strong className='antialiased'>Redeem code</strong>
      </Button>
    </div>
  )
}

export default ManualRedeem
