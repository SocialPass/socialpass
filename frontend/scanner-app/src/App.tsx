import { Toaster } from 'react-hot-toast'

import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'

import Router from './routes'

const App = () => {
  return (
    <EventProvider>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </EventProvider>
  )
}

export default App
