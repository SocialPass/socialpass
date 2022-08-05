import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { EventProvider } from './contexts/EventContext'
import { ToastProvider } from './contexts/ToastContext'

import EventRoutes from './routes/EventRoutes'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
})

declare global {
  interface ImportMeta {
    env: {
      PROD: string
      DEV: string
      VITE_APP_API_URL: string
    }
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <EventProvider>
          <EventRoutes />
        </EventProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
