import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'

import EventLoading from '@/components/EventLoading'

import { useEvent } from '@/contexts/EventContext'

import { Footer } from '@/components/Footer'
import { NavBar } from '@/components/NavBar'

const Base = () => {
  const navigate = useNavigate()
  const { redemptionPublicId } = useParams()
  const { event, getEvent, isLoading, error }: any = useEvent()

  useEffect(() => {
    if (!event || event.publicId !== redemptionPublicId) {
      getEvent(redemptionPublicId).catch(() => {
        navigate('/error')
      })
    }
  }, [redemptionPublicId])

  return (
    <div className='content'>
      {isLoading ? (
        <EventLoading />
      ) : !error && event ? (
        <div className='page-wrapper'>
          <div className='content-wrapper ws-600 mw-100 min-vh-100 mx-auto d-flex flex-column'>
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
