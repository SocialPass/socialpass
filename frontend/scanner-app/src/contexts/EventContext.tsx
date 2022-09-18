import { createContext, useContext, useState } from 'react'
import { RedemptionApi } from '@/services/api'
import { Event, EventError } from '@/types/Event'

const EventContext = createContext({})

const EventProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [event, setEvent] = useState<Event>()
  const [error, setError] = useState<EventError>()

  const getEvent = (eventPublicId: string) =>
    new Promise((resolve, reject) => {
      setIsLoading(true)

      RedemptionApi.get(eventPublicId)
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

function useEvent() {
  const context = useContext(EventContext)

  if (!context) {
    throw new Error('useEvent must be used within a EventProvider')
  }

  return context
}

export { EventProvider, useEvent }
