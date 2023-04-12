import { Provider } from '@rollbar/react';
import { Toaster } from 'react-hot-toast'

import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './routes'

const rollbarConfig = {
   accessToken: "e19adfa974894504b3d7b717c7c5f055",
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

const App = () => {
  return (
    <Provider config={rollbarConfig}>
    <EventProvider>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </EventProvider>
    </Provider>
  )
}

export default App
