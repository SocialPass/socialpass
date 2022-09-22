import { Toaster } from 'react-hot-toast'

import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'

import Routes from './routes'

const App = () => {
  return (
    <EventProvider>
      <ThemeProvider>
        <Routes />
        <Toaster />
      </ThemeProvider>
    </EventProvider>
  )
}

export default App
