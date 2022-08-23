/* eslint-disable eqeqeq */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchEvent } from '../services/api'
import { useQuery } from 'react-query'

const EventContext = createContext({})

type EventDataProps = {
  title: string
  start_date: string
  localized_address_display: string
  capacity: number
  ticket_count: number
  redeemed_count: number
  team: string
}

const EventProvider = ({ children }: any) => {
  const [publicId, setPublicId] = useState<string>('')
  const [eventData, setEventData] = useState<EventDataProps>()
  const { status, isLoading, isError, error, data, refetch } = useQuery(
    ['fetchEvent', publicId],
    () => fetchEvent(publicId),
    {
      enabled: false,
    },
  )

  useEffect(() => {
    if (publicId) {
      refetch()
    }
  }, [publicId])

  useEffect(() => {
    setEventData(data)
  }, [data])

  return (
    <EventContext.Provider
      value={{
        publicId,
        setPublicId,
        status,
        isLoading,
        isError,
        eventData,
        setEventData,
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
