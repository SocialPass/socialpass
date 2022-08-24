import { act, render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { EventPortalProvider } from '../../context'
import { CheckoutWeb3 } from '../../pages'
import RequiresEvent from '../../utils/requiresEventHOC'

const checkoutWeb3 = {
  httpStatus: 200,
  title: 'Ownership Verification',
  description: 'Verifies if a given NFT is in the Wallet',
}

const mockCall = jest.fn(() => checkoutWeb3)

jest.mock('../../api.tsx', () => ({
  TicketedEventRetrieve: {
    call: () => mockCall(),
  },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
})

describe('Checkout Web3 Page', () => {
  it('should render correctly', async () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <EventPortalProvider>
            <RequiresEvent>
              <CheckoutWeb3 />
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
