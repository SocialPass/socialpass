import React, { useState } from 'react'
import propTypes from 'prop-types'

import Pagination from './Pagination'

const TicketList = (props) => {
  const { tickets } = props

  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const getPageCount = () => Math.ceil(tickets.length / pageSize)

  const getTicketsPage = () => {
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, tickets.length)

    return tickets.slice(startIndex, endIndex)
  }

  return (
    <>
      <div className='fs-base-n2 mt-15'>
        {getTicketsPage()?.map((ticket) => (
          <div className='py-10 border-top' key={`ticket-${ticket.publicId}`}>
            <div>
              <strong>Wallet: </strong> {ticket.wallet_address}
            </div>
            <div className='fw-700 text-primary mt-5'>Issued:</div>
            <div>{ticket.created}</div>
            {ticket.redeemed ? (
              <>
                <div className='fw-700 text-primary mt-5'>Redeemed:</div>
                <div>{ticket.redeemed_at}</div>
              </>
            ) : null}
          </div>
        ))}
      </div>

      <Pagination count={getPageCount()} page={page} onChange={handleChangePage} />
    </>
  )
}

export default TicketList

TicketList.propTypes = {
  tickets: propTypes.array,
}
