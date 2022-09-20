import { useNavigate } from 'react-router-dom'
import useEvent from '@/hooks/useEvent'
import { EventContainer } from '@/components/EventContainer'
import { Button } from '@/components/Button'
import NavBar from '@/components/NavBar'

const EventInfo = () => {
  const { event }: any = useEvent()
  const navigate = useNavigate()

  return (
    <>
      <NavBar />

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

export default EventInfo
