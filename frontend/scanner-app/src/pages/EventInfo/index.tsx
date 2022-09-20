import { useNavigate } from 'react-router-dom'
import { useEvent } from '@/contexts/EventContext'
import { EventContainer } from '@/components/EventContainer'
import { Button } from '@/components/Button'

export function EventInfo() {
  const { event }: any = useEvent()
  const navigate = useNavigate()

  return (
    <>
      <EventContainer event={event} />

      <div className='content'>
        <Button
          className='btn-lg py-15 fs-base-p4'
          onClick={() => {
            navigate('scanner')
          }}
        >
          <strong className='antialiased'>Start Scanning</strong>
        </Button>
      </div>
    </>
  )
}
