import { useEvent } from '../contexts/EventContext'
import { EventContainer } from '../components/EventContainer'
import { CopyrightFooter } from '../components/CopyrightFooter'

export function Home() {
  const { eventData }: any = useEvent()
  return (
    <>
      <div className="landing-page-body p-10 py-10">
        <div className="d-flex flex-column align-items-center justify-content-around">
          <img id="SocialPassHeaderIcon" className="p-15" src={window.icon} style={{maxHeight:"120px"}} />
          <div></div>
          <EventContainer
            event_name={eventData.title}
            event_attendance={eventData.capacity}
            event_date={eventData.start_date}
            event_venue={eventData.location}
          />
        </div>
        <CopyrightFooter/>
      </div>
    </>
  )
}
