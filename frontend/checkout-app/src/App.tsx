import { WagmiConfig } from 'wagmi'
import { Web3Provider } from './contexts/Web3Provider'

import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CheckoutProvider } from './contexts/CheckoutContext'

import Router from './routes'

export default function App() {
  return (
    <WagmiConfig client={Web3Provider}>
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
