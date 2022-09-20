import React from 'react'
import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'

import Routes from './routes'

const App = () => {
  return (
    <EventProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </EventProvider>
  )
}

export default App
