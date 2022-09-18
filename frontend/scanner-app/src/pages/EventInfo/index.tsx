import { useNavigate } from 'react-router-dom'
import { useEvent } from '@/contexts/EventContext'
import { EventContainer } from '@/components/EventContainer'
import { Button } from '@/components/Button'

export function EventInfo() {
  const { event }: any = useEvent()
  const navigate = useNavigate()

  return (
    <>
      <div className='landing-page-body p-10 py-10'>
        <div className='d-flex flex-column align-items-center justify-content-around'>
          <img id='SocialPassHeaderIcon' className='landing-page-logo' src={window.icon} />

          <EventContainer event={event} />

          <div className='container px-20 py-5 d-flex flex-column'>
            <Button
              onClick={() => {
                navigate('scanner')
              }}
            >
              Start Scanning
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
