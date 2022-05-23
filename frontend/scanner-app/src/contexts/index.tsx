import React from "react";
import { ToastProvider } from "./ToastContext";

const AppProvider = ({ children }: JSX.ElementChildrenAttribute) => (
  <ToastProvider>{children}</ToastProvider>
);

export default AppProvider;
