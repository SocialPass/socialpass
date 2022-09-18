import React from 'react'
import { EventProvider } from './contexts/EventContext'

import Routes from './routes'

const App = () => {
  return (
    <EventProvider>
      <Routes />
    </EventProvider>
  )
}

export default App
