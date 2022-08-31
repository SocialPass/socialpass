import { act, render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { EventPortalProvider } from '../../context'
import CheckoutSuccessPage from '../../components/CheckoutSuccessPage'
import RequiresEvent from '../../utils/requiresEventHOC'

const wallet_redirection = {
  httpStatus: 200,
  //understand what is the structure of infos i need to put in
}

const mockCall = jest.fn(() => wallet_redirection)

jest.mock('../../api.tsx', () => ({
  TicketedEventRetrieve: {
    call: () => mockCall(),
  },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
})

const TicketedEventRequestAccess = new TicketedEventRequestAccess({

})


describe('Success Page component', () => {
  it('should render correctly', async () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <EventPortalProvider>
          <RequiresEvent>
            <CheckoutSuccessPage />
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
