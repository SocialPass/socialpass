import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";


Sentry.init({
  dsn: "https://8227fd5bdda44be2a150e7b6592c5098@o1251100.ingest.sentry.io/6766642",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
