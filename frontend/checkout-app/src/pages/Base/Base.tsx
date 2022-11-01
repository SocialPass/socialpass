import { useEffect } from 'react'

import { Outlet, useParams, useNavigate } from 'react-router-dom'

import EventLoading from '@/components/EventLoading'

import useEvent from '@/hooks/useEvent'
import useTheme from '@/hooks/useTheme'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

const Base = () => {
  const navigate = useNavigate()
  const { eventPublicId } = useParams()
  const { event, getEvent, isLoading, error }: any = useEvent()
  const { isReady }: any = useTheme()

  useEffect(() => {
    if (!event || event.publicId !== eventPublicId) {
      getEvent(eventPublicId)
    }
  }, [eventPublicId])

  useEffect(() => {
    if (error) {
      navigate(`/${eventPublicId}/error`)
    }
  }, [error])

  return (
    <div>
      {error ? (
        <Outlet />
      ) : isLoading || !isReady ? (
        <EventLoading />
      ) : event ? (
        <div className='page-wrapper'>
          <div className='content-wrapper ws-860 mw-100 min-vh-100 mx-auto bg-white-lm bg-dark-very-light-dm d-flex flex-column'>
            <NavBar />

            <Outlet />

            <Footer />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Base
