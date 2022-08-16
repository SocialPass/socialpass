/* eslint-disable no-unused-labels */
import { render } from '@testing-library/react'
import { TicketedEventRetrieve } from '../../api'
import { Event } from '../../pages'

jest.mock('../../api.tsx', () => ({
  TicketedEventRetrieve: {
    call: jest.fn(),
  },
}))

describe('Event component', () => {
  it('should render correctly', async () => {
    render(<Event />)
    // expect(mockFetchEvent).toHaveBeenCalled()
  })
})
