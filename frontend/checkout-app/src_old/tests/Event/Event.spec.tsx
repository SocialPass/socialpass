import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { CheckoutPortalContext } from '../../context'
import { Event } from '../../pages'
import RequiresEvent from '../../utils/requiresEventHOC'


// Mocks API for usage by context provider
// That way, queryClient does not need to ping the actual API to run the tests
jest.mock('../../api.tsx', () => jest.fn())

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
})

// Simple description on what will be tested
describe('Event component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

// Expected behaviour from component given certain parameters
// The parameters are assigned to the Context Provider via "value"
  it('should render correctly if status 200', async () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CheckoutPortalContext.Provider
          // Mocked parameters below
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

// We then combine functions from Jest and React Test Library
// From Jest, we utilize "expect" which enables us to utilize a range of matchers to validate things
// From React Test Library we utilize "getByText" to look into a div with a certain content...
// ...and also utilize "toBeInTheDocument" to assert if the described element is on the body of a document or not.
// In that specific case we are mocking a 200 HTTP call so
// the two elements ("event name" and "event description") need to be present.
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
// From the following line until the end of value we are stating every parameter from the context provider
// Ideally we would only need to attribute values to the properties that this test uses but in doing so...
// ...an error gets raised, stating that the type "missing the following properties from type"
// and proceeds to list every state that was not attributed.
// This should be improved in further interations as the current approach of including every state
// seems non-ideal.
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

// In the case below we are mocking a 404 HTTP call so
// the two elements ("event name" and "event description") should not be found on the document.
    expect(screen.queryByText('event name')).toBeNull()
    expect(screen.queryByText('event description')).toBeNull()
  })
})

