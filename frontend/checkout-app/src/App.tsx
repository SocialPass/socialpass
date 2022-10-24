import { WagmiConfig } from 'wagmi'
import { client } from './services/wagmi'

import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CheckoutProvider } from './contexts/CheckoutContext'

import Router from './routes'

export default function App() {
  return (
    <WagmiConfig client={client}>
      <EventProvider>
        <ThemeProvider>
          <CheckoutProvider>
            <Router />
          </CheckoutProvider>
        </ThemeProvider>
      </EventProvider>
    </WagmiConfig>
  )
}
