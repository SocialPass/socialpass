import { createContext, useEffect, useState } from 'react'
import { TicketedEventRetrieve } from '../api'
import { CheckoutPortalContextInterface } from '../types'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

export const CheckoutPortalContext = createContext<CheckoutPortalContextInterface>(
  {} as CheckoutPortalContextInterface,
)

export const EventPortalProvider = ({ children }: { children: any }) => {
  const location = useLocation()

  const [id, setID] = useState<string>('')
  const [headerType, setHeaderType] = useState<string>('light')

  const [retrieveJson, setRetrieveJson] = useState(null)
  const [retrieveError, setRetrieveError] = useState(null)

  const [requestAccessJson, setRequestAccessJson] = useState(null)
  const [requestAccessError, setRequestAccessError] = useState(null)

  const [grantAccessJson, setGrantAccessJson] = useState(null)
  const [grantAccessError, setGrantAccessError] = useState(null)

  const [generalAdmissionSelect, setGeneralAdmissionSelect] = useState(1)

  const [web3CheckoutSelection, setWeb3CheckoutSelection] = useState([])
  const [eventStatusCheckout, setEventStatusCheckout] = useState(true)

  const { status, isLoading, isError, data, refetch } = useQuery(
    ['fetchEvent', id],
    () => fetchEvent(id),
    {
      enabled: true,
    },
  )

  useEffect(() => {
    setHeaderType('dark')
  }, [location])

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id])

  useEffect(() => {
    setRetrieveJson(data)
  }, [data, id])

  function fetchEvent(publicId: string) {
    return TicketedEventRetrieve.call({ public_id: publicId })
  }

  return (
    <CheckoutPortalContext.Provider
      value={{
        id,
        setID,

        status,
        isLoading,
        isError,

        web3CheckoutSelection,
        setWeb3CheckoutSelection,

        retrieveJson,
        setRetrieveJson,
        retrieveError,
        setRetrieveError,

        requestAccessJson,
        setRequestAccessJson,
        setRequestAccessError,
        requestAccessError,

        grantAccessJson,
        setGrantAccessJson,
        grantAccessError,
        setGrantAccessError,

        eventStatusCheckout,
        setEventStatusCheckout,

        generalAdmissionSelect,
        setGeneralAdmissionSelect,

        headerType,
        setHeaderType,
      }}
    >
      {children}
    </CheckoutPortalContext.Provider>
  )
}
