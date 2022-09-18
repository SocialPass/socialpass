import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'

import EventLoading from '@/components/EventLoading'

import { useEvent } from '@/contexts/EventContext'

import { CopyrightFooter } from '@/components/CopyrightFooter'

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
        <>
          <Outlet />
          <CopyrightFooter />
        </>
      ) : null}
    </div>
  )
}

export default Base
