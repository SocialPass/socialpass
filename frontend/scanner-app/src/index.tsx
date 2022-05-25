import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { createServer, Model } from "miragejs";

createServer({
  models: {
    eventInfo: Model,
  },

  seeds(server) {
    server.db.loadData({
      eventInfo: {
        id: 1,
        attendees: 212,
        totalAmount: 1000,
        createdAt: new Date("2022-05-22 09:00:00"),
      },
    });
  },

  routes() {
    this.namespace = "api";

    this.get("/eventInfo", () => {
      return this.schema.all("eventInfo");
    });

    this.post("/ticketToken", (schema, request) => {
      const data = JSON.parse(request.requestBody);
      console.log(data);

      return { status: "succeess" };
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
