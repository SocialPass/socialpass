import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { CheckoutPortalContext } from '../../context'
import { Event } from '../../pages'
import RequiresEvent from '../../utils/requiresEventHOC'

jest.mock('../../api.tsx', () => jest.fn())

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
})

describe('Event component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })
  it('should render correctly if status 200', async () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CheckoutPortalContext.Provider
            value={{
              retrieveJson: {
                httpStatus: 200,
                title: 'event name',
                description: 'event description',
              },
              id: '',
              status: 'success',
              isLoading: false,
              isError: false,
              setID: jest.fn(),
              generalAdmissionSelect: 1,
              setGeneralAdmissionSelect: jest.fn(),
              web3CheckoutSelection: '',
              setWeb3CheckoutSelection: '',
              setRetrieveJson: '',
              retrieveError: '',
              setRetrieveError: '',
              requestAccessJson: '',
              setRequestAccessJson: '',
              setRequestAccessError: '',
              requestAccessError: '',
              grantAccessJson: '',
              setGrantAccessJson: '',
              grantAccessError: '',
              setGrantAccessError: '',
              eventStatusCheckout: false,
              setEventStatusCheckout: '',
              headerType: '',
              setHeaderType: '',
            }}
          >
            <RequiresEvent>
              <Event />
            </RequiresEvent>
          </CheckoutPortalContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>,
    )


    expect(screen.getByText('event name')).toBeInTheDocument()
    expect(screen.getByText('event description')).toBeInTheDocument()
  })

  it('should render correctly if status 404', async () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CheckoutPortalContext.Provider
            value={{
              retrieveJson: {
                httpStatus: 200,
              },
              id: '',
              status: 'success',
              isLoading: false,
              isError: true,
              setID: jest.fn(),
              generalAdmissionSelect: 1,
              setGeneralAdmissionSelect: jest.fn(),
              web3CheckoutSelection: '',
              setWeb3CheckoutSelection: '',
              setRetrieveJson: '',
              retrieveError: '',
              setRetrieveError: '',
              requestAccessJson: '',
              setRequestAccessJson: '',
              setRequestAccessError: '',
              requestAccessError: '',
              grantAccessJson: '',
              setGrantAccessJson: '',
              grantAccessError: '',
              setGrantAccessError: '',
              eventStatusCheckout: false,
              setEventStatusCheckout: '',
              headerType: '',
              setHeaderType: '',
            }}
          >
            <RequiresEvent>
              <Event />
            </RequiresEvent>
          </CheckoutPortalContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>,
    )

    expect(screen.queryByText('event name')).toBeNull()
    expect(screen.queryByText('event description')).toBeNull()
  })
})

