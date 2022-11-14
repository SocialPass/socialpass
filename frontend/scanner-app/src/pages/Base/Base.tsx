import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'

import EventLoading from '@/components/EventLoading'

import useEvent from '@/hooks/useEvent'
import useTheme from '@/hooks/useTheme'

import { Footer } from '@/components/Footer'

const Base = () => {
  const navigate = useNavigate()
  const { redemptionPublicId } = useParams()
  const { event, getEvent, isLoading, error }: any = useEvent()
  const { isReady }: any = useTheme()

  useEffect(() => {
    if (!event || event.publicId !== redemptionPublicId) {
      getEvent(redemptionPublicId)
    }
  }, [redemptionPublicId])

  useEffect(() => {
    if (error) {
      navigate(`/${redemptionPublicId}/error`)
    }
  }, [error])

  return (
    <div className='content-wrapper'>
      {error ? (
        <Outlet />
      ) : isLoading || !isReady ? (
        <EventLoading />
      ) : event ? (
        <div className='page-wrapper'>
          <div className='content-wrapper ws-600 mw-100 min-vh-100 mx-auto d-flex flex-column'>
            <Outlet />

            <Footer />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Base
