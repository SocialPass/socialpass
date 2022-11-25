import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'

const Pagination = (props) => {
  const { count, onChange, page } = props

  return (
    <div className='d-flex align-content-center border-top pt-20'>
      <div>
        <button
          className='btn btn-sm btn-square btn-rounded'
          onClick={(e) => {
            onChange(e, page - 1)
          }}
          disabled={page === 1}
        >
          <i className='fa-regular fa-arrow-left'></i>
          <span className='visually-hidden'>Previous</span>
        </button>
      </div>

      <ul className='pagination pagination-sm pagination-rounded my-0 ms-auto'>
        {Array.from(Array(count).keys()).map((i) => (
          <li className={`page-item ${i + 1 === page ? 'active' : ''}`}
            key={`ticket-page-${i}`}
            onClick={(e) => {
              onChange(e, i + 1)
            }}>
            <a href='#' className='page-link'>
              {i + 1}
            </a>
          </li>
        ))}
      </ul>

      <div className='ms-auto'>
        <button
          className='btn btn-sm btn-square btn-rounded'
          onClick={(e) => {
            onChange(e, page + 1)
          }}
          disabled={page === count}

        >
          <i className='fa-regular fa-arrow-right'></i>
          <span className='visually-hidden'>Next</span>
        </button>
      </div>
    </div>
  )
}

export default Pagination

Pagination.propTypes = {
  count: propTypes.number,
  onChange: propTypes.func,
  page: propTypes.number,
}
