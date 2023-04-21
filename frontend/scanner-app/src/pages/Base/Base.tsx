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

  let successBleep = new Audio(
    'https://audio.jukehost.co.uk/1tzXHHljHV2r3YFRijEZmvd4SnvY1uOu'
  )
  const successPlay = () => {
    successBleep.play()
  }

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
          <div className='position-fixed' style={{ top: -10000 }}>
            <button
              id='successPlay'
              type='button'
              onClick={successPlay}
            >
              Play success
            </button>
          </div>
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
