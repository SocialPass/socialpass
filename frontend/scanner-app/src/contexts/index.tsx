import React from "react";
import { ToastProvider } from "./ToastContext";
import { TicketProvider } from "./TicketContext";

const AppProvider = ({ children }: JSX.ElementChildrenAttribute) => (
  <ToastProvider>
    <TicketProvider>{children}</TicketProvider>
  </ToastProvider>
);

export default AppProvider;
