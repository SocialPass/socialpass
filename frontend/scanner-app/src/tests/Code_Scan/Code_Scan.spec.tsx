import { act, render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { EventPortalProvider } from '../../context'
import { Event } from '../../pages'
import RequiresEvent from '../../utils/requiresEventHOC'

const event = {
  httpStatus: 200,
  title: 'event name',
  description: 'event name',
}

const mockCall = jest.fn(() => event)

jest.mock('../../api.tsx', () => ({
  TicketedEventRetrieve: {
    call: () => mockCall(),
  },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
})

describe('Event component', () => {
  it('should render correctly', async () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <EventPortalProvider>
            <RequiresEvent>
              <Event />
            </RequiresEvent>
          </EventPortalProvider>
        </QueryClientProvider>
      </BrowserRouter>,
    )
    await wait(100)
    expect(mockCall).toHaveBeenCalled()
  })
})

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  })
}
