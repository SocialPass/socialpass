import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import App from './App'

// Init Sentry
Sentry.init({
   dsn: 'https://8227fd5bdda44be2a150e7b6592c5098@o1251100.ingest.sentry.io/6766642',
   integrations: [new BrowserTracing()],
   sendDefaultPii: false,
   environment: import.meta.env.VITE_APP_SENTRY_ENVIRONMENT
 });


// Create container
const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)
