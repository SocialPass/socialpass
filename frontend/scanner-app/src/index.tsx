import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";
import { createServer, Model } from "miragejs";

createServer({
  models: {
    eventInfo: Model,
  },

  seeds(server) {
    server.db.loadData({
      eventInfo: {
        event_name: "Event Name",
        event_attendance: "750",
        event_capacity: "1000",
        event_date: "2022-12-12T22:30:00Z",
        event_venue: "The Ritz Carlton - South Beach",
      },
    });
  },

  routes() {
    this.namespace = "api";

    this.get("/eventInfo", () => {
      return this.schema.all("eventInfo");
    });

    this.post("/ticketToken/success", (schema, request) => {
      const data = JSON.parse(request.requestBody);
      console.log(data);

      return { status: "succeess" };
    });

    this.post("/ticketToken/error", (schema, request) => {
      const data = JSON.parse(request.requestBody);
      console.log(data);

      return { status: "error" };
    });
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
