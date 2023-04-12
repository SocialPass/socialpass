import { WagmiConfig } from 'wagmi'
import { client } from './services/wagmi'
import { Provider } from '@rollbar/react';

import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CheckoutProvider } from './contexts/CheckoutContext'
import Router from './routes'

const rollbarConfig = {
   accessToken: '86a31882f236497db5c142da8ba72a5f',
   captureUncaught: true,
   captureUnhandledRejections: true,
   payload: {
     client: {
       javascript: {
         code_version: import.meta.env.CF_PAGES_COMMIT_SHA,
         source_map_enabled: true,
         guess_uncaught_frames: true
       }
     }
   }
 };

export default function App() {
  return (
    <Provider config={rollbarConfig}>
    <WagmiConfig client={client}>
      <EventProvider>
        <ThemeProvider>
          <CheckoutProvider>
            <Router />
          </CheckoutProvider>
        </ThemeProvider>
      </EventProvider>
    </WagmiConfig>
    </Provider>
  )
}
