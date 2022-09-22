import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useEvent from '@/hooks/useEvent'
import { TicketApi } from '@/services/api'

import { TicketList } from './TicketList'
import Button from '@/components/Button'
import NavBar from '@/components/NavBar'

type MyParams = {
  redemptionPublicId: string
}

const Statistics = () => {
  const navigate = useNavigate()

  const { redemptionPublicId } = useParams<keyof MyParams>() as MyParams

  const { event }: any = useEvent()
  const [isRedeemed, setIsRedeemed] = useState(true)
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    TicketApi.getAll(redemptionPublicId)
      .then((res) => {
        setIsLoading(false)
        setTickets(res.data.results)
      })
      .catch(() => {
        setIsLoading(false)
        setIsError(true)
      })
  }, [])

  const ticketsFiltered = tickets.filter((ticket: any) => ticket.redeemed === isRedeemed)

  return (
    <>
      <NavBar />

      <div className='mt-auto'>
        <div className='card text-base rounded-4 shadow-lg border-transparent'>
          <h1 className='fw-700 text-center fs-base-p6 mt-0'>Statistics &mdash; {event.title}</h1>

          {isLoading ? (
            <div className='text-center mb-20'>
              <div className='spinner-border text-primary text-center' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          ) : isError ? (
            <div className='text-center text-danger mb-20'>Error getting Statistics data</div>
          ) : (
            <>
              <div className='row'>
                <div className='col-6 pe-5'>
                  <button
                    type='button'
                    className={`btn  btn-link  px-10 btn-block h-100 rounded-3 ${
                      isRedeemed ? 'btn-primary' : ''
                    }`}
                    onClick={() => {
                      setIsRedeemed(true)
                    }}
                  >
                    <strong className='antialiased'>Claimed</strong>
                  </button>
                </div>
                <div className='col-6 ps-5'>
                  <button
                    type='button'
                    className={`btn  btn-link  px-10 btn-block h-100 rounded-3 ${
                      !isRedeemed ? 'btn-primary' : ''
                    }`}
                    onClick={() => {
                      setIsRedeemed(false)
                    }}
                  >
                    <strong className='antialiased'>Unclaimed</strong>
                  </button>
                </div>
              </div>

              <div className='mt-15'>
                <strong>Total:</strong> {ticketsFiltered.length} tickets{' '}
                {isRedeemed ? 'claimed' : 'unclaimed'}
              </div>

              <TicketList tickets={ticketsFiltered} />
            </>
          )}

          <div className='container p-5 d-flex flex-column'>
            <Button
              className='py-15 fs-base-p4'
              onClick={() => {
                navigate(`/${redemptionPublicId}/scanner`)
              }}
            >
              <i className='fa-regular fa-arrow-left me-5'></i>

              <strong className='antialiased'>Return to Scanner</strong>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Statistics
