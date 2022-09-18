import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useEvent } from '@/contexts/EventContext'
import { TicketApi } from '@/services/api'
import Table from '../Table'
import useWindowDimensions from '@/hooks/useWindowDimensions'

export function StatisticsTable() {
  const { publicId }: any = useEvent()
  const [isRedeemed, setIsRedeemed] = useState(true)

  const { isLoading, isError, data } = useQuery(['fetchTickets', isRedeemed], () =>
    TicketApi.getAll(publicId, isRedeemed),
  )

  const { height } = useWindowDimensions()
  const elementsRendered = Math.floor(height / 140)

  if (isLoading) return <>Loading</>
  if (isError) return <>Oops something went wrong</>

  return (
    <div>
      <div className='d-flex flex-row align-items-center px-20 mt-20'>
        <button
          className={`${'btn-selected-statistic flex-grow-1'} ${
            isRedeemed === true ? 'btn-active' : 'btn-inactive'
          }`}
          onClick={() => setIsRedeemed(() => true)}
        >
          Claimed
        </button>
        <button
          className={`${'btn-selected-statistic flex-grow-1'} ${
            isRedeemed === true ? 'btn-inactive' : 'btn-active'
          }`}
          onClick={() => setIsRedeemed(() => false)}
        >
          Unclaimed
        </button>
      </div>
      <div className='statistics-table-container d-flex flex-column align-items-center p-10'>
        <Table data={data} rowsPerPage={elementsRendered} />
      </div>
    </div>
  )
}
