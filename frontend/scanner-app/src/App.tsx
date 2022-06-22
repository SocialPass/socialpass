import React from "react";
import { EventProvider } from "./contexts/EventContext";
import { ToastProvider } from "./contexts/ToastContext";

import EventRoutes from "./routes/EventRoutes";

function App() {
  return (
    <ToastProvider>
      <EventProvider>
        <EventRoutes />
      </EventProvider>
    </ToastProvider>
  );
}

export default App;
