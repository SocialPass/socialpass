/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable no-unused-labels */
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Event } from '../../pages'

const event = {
  title: 'event name',
  description: 'event name',
}

jest.mock('../../api.tsx', () => ({
  TicketedEventRetrieve: {
    call: jest.fn(() => event),
  },
}))

describe('Event component', () => {
  it('should render correctly', async () => {
    render(
      <BrowserRouter>
        <Event />
      </BrowserRouter>,
    )
    expect('event name').toBeInTheDocument()
  })
})
