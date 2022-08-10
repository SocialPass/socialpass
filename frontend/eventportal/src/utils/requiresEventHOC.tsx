import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loading } from '../components'
import { CheckoutPortalContext } from '../context'

function RequiresEvent({ children }: any) {
  const { status, isLoading, isError, setID, retrieveJson } = useContext(CheckoutPortalContext)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setID(params.publicId)
  }, [params])

  useEffect(() => {
    if (isError) {
      navigate('../error')
    }
  }, [isError])

  if (isError) {
    return null
  }

  if (isLoading) {
    // TODO: this should be a loading spinner
    return <Loading loadingText='Loading event' />
  }

  if (status !== 'success' || retrieveJson === undefined) {
    return null
  }

  return <>{children}</>
}

export default RequiresEvent
