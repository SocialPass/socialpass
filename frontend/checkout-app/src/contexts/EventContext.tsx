import { createContext, useState } from 'react'
import { EventApi } from '@/services/api'
import { Event, EventError, EventContextType } from '@/types/Event'

export const EventContext = createContext<EventContextType>({
  event: null,
  getEvent: () => new Promise(() => null),
  isLoading: false,
  error: null,
})

export const EventProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [error, setError] = useState<EventError | null>(null)

  const getEvent = (eventPublicId: string) =>
    new Promise((resolve, reject) => {
      setIsLoading(true)
      setError(null)
      setEvent(null)

      EventApi.get(eventPublicId)
        .then((response) => {
          setEvent(response.data)
          setIsLoading(false)
          resolve(response.data)
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
          reject(err)
        })
    })

  return (
    <EventContext.Provider
      value={{
        event,
        getEvent,
        isLoading,
        error,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export default EventProvider
