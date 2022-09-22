import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";


Sentry.init({
  dsn: "https://27eacbe053014ec7a4d481fd4d489860@o1251100.ingest.sentry.io/6766649",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
